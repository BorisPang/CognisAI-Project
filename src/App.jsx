import React, { useState, useEffect, useMemo } from 'react';
import { BookOpen, MonitorPlay, ClipboardCheck, ArrowRight, BrainCircuit, User, Bell, Search, BarChart3, ChevronRight, X, FileText, CheckCircle, Wrench, FileQuestion, Sparkles, Loader2, Lock, AlertCircle, TrendingUp, Users, Target, CheckCircle2, Clock, FileSpreadsheet, ChevronDown, ChevronUp, UploadCloud, RefreshCw, CheckSquare, Presentation, Lightbulb, ArrowDownToLine, Layers, Settings2, Send, MessageSquare, Activity } from 'lucide-react';

// --- 数据定义 ---
const radarDimensions = [
  { name: '知识理解', max: 100 },
  { name: '实践应用', max: 100 },
  { name: '创新能力', max: 100 },
  { name: '协作沟通', max: 100 },
  { name: '学习态度', max: 100 },
];

const studentRadarData = [85, 78, 92, 88, 95];

const knowledgeModules = [
  { name: '电工仪表与测量的基本知识', progress: 95, color: 'bg-blue-500' },
  { name: '电流与电压的测量', progress: 88, color: 'bg-indigo-500' },
  { name: '功率与电能的测量', progress: 72, color: 'bg-teal-500' },
  { name: '频率与相位的测量', progress: 65, color: 'bg-cyan-500' },
  { name: '电路参数的测量', progress: 80, color: 'bg-sky-500' },
  { name: '波形的测量', progress: 54, color: 'bg-blue-400' },
];

const courseList = [
  "第一章第1-3节 电工仪表与测量的基本方法",
  "第一章第4-6节 误差的表示和消除",
  "第二章第1-2节 电压与电流的测量&磁电系仪表",
  "第二章第3-4节 磁电系检流计&电磁系仪表",
  "第二章第5-7节 电动系仪表&万用电表",
  "第二章第8-10节 直流电位差计&电子系电压表",
  "第三章第1-4节 功率与电能的测量",
  "第三章第5-7节 三相有功电能表",
  "第三章第8-9节 电子式单相&三相电能表",
  "第四章第1-5节 频率与相位的测量",
  "第五章第1-3节 电路参数的测量（一）",
  "第五章第4-7节 电路参数的测量（二）",
  "第六章第1-7节 波形的测量",
  "第八章第1-4节 数字电压表",
  "第九章第1-3节 数字功率表&第十章第1-3节 数字频率表",
  "第十一章第1-3节 数字参数测量仪&第十二章第1-4节 数字示波器"
];

// --- 备课模式 - 课程知识点列表 Mock 数据 (简化版) ---
const knowledgePointMockData = [
  {
    chapter: "第一章",
    name: "电工仪表与测量的基本知识",
    objective: "理解电工仪表的工作原理，掌握测量误差的计算方法",
    keyPoints: "仪表分类、误差计算"
  },
  {
    chapter: "第二章",
    name: "电流与电压的测量",
    objective: "掌握磁电系、电磁系、电动系仪表的工作原理",
    keyPoints: "仪表结构、工作原理"
  },
  {
    chapter: "第三章",
    name: "功率与电能的测量",
    objective: "掌握功率表和电能表的原理与使用方法",
    keyPoints: "单相功率测量、三相功率测量"
  },
  {
    chapter: "第四章",
    name: "频率与相位的测量",
    objective: "理解频率表和相位差测量方法",
    keyPoints: "频率测量、相位差测定"
  },
  {
    chapter: "第五章",
    name: "电路参数的测量",
    objective: "掌握电阻、电容、电感的测量方法",
    keyPoints: "电桥法、示波器法"
  }
];

// --- 动态获取弹窗选项 ---
const getModalOptions = (title, course) => {
  if (title === '备课') return [{ label: '思政导入', path: '备课-思政导入', icon: BookOpen }, { label: '案例生成', path: '备课-案例生成', icon: FileText }];
  if (title === '课后') return [{ label: '布置作业', path: '课后-布置作业', icon: FileQuestion }, { label: '评价结果', path: '课后-评价结果', icon: BarChart3 }];
  if (title === '上课') {
    if (course === '第一章第4-6节 误差的表示和消除') {
      return [
        { label: '智能工厂配电系统故障诊断', path: '上课-智能工厂配电系统故障诊断', icon: Wrench }, 
        { label: '电压表出厂校验闯关', path: '上课-电压表出厂校验闯关', icon: CheckCircle }
      ];
    }
    if (course === '第四章第1-5节 频率与相位的测量') {
      return [
        { label: '微分型频率表原理演示', path: '上课-微分型频率表原理演示', icon: Wrench }, 
        { label: '相序与相位差测定', path: '上课-相序与相位差测定', icon: CheckCircle }
      ];
    }
  }
  return [];
};

// --- Gemini API 核心工具函数 ---
const generateWithGemini = async (prompt) => {
  const apiKey = ""; 
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
  const payload = { contents: [{ parts: [{ text: prompt }] }] };

  const delays = [1000, 2000, 4000, 8000, 16000];
  for (let attempt = 0; attempt <= 5; attempt++) {
    try {
      const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const result = await response.json();
      return result.candidates?.[0]?.content?.parts?.[0]?.text || "未获取到有效内容。";
    } catch (error) {
      if (attempt === 5) return `生成失败，请检查网络或稍后重试。\n错误信息: ${error.message}`;
      await new Promise(res => setTimeout(res, delays[attempt]));
    }
  }
};

// --- 动态生成占位 HTML ---
const getPlaceholderHTML = (moduleName) => `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>${moduleName}</title>
    <style>
        body { font-family: sans-serif; background-color: #f8fafc; color: #334155; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; flex-direction: column;}
        h1 { color: #475569; font-size: 24px; margin-bottom: 16px;}
        p { color: #94a3b8; }
        .btn { margin-top: 30px; padding: 12px 24px; background: #0ea5e9; color: #fff; border: none; cursor: pointer; font-weight: bold; border-radius: 6px; transition: 0.3s; }
        .btn:hover { background: #0284c7; }
    </style>
</head>
<body>
    <div style="text-align: center;">
        <h1>${moduleName} (占位)</h1>
        <p>该教学案例/实训模块的交互沙盘内容暂时留空</p>
        <button id="finishBtn" class="btn">完成本环节实训</button>
    </div>
    <script>
        document.getElementById('finishBtn').addEventListener('click', function() {
            this.innerText = '实训已记录 ✔';
            this.style.background = '#059669';
            if(window.parent) window.parent.postMessage({ type: 'MODULE_COMPLETED', module: '${moduleName}' }, '*');
        });
    </script>
</body>
</html>`;

// --- 嵌入的 HTML 模块数据 ---

// 1. 第一章：配电系统故障诊断沙盘
const ghostTrippingHTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>变电站幽灵跳闸事件 - AI 引导式排障实录</title>
    <style>
        :root {
            --bg-dark: #1e1e2f; --panel-bg: #2a2a40; --text-main: #e0e0e0;
            --accent-blue: #00d2ff; --accent-red: #ff4b4b; --accent-green: #00e676; --border-color: #444466;
        }
        body { font-family: 'Segoe UI', Tahoma, sans-serif; background-color: var(--bg-dark); color: var(--text-main); margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
        .container { width: 95%; max-width: 1200px; height: 90vh; background: var(--panel-bg); border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); display: flex; flex-direction: column; overflow: hidden; border: 1px solid var(--border-color); }
        .header { background: #151522; padding: 15px 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid var(--border-color); }
        .header h1 { margin: 0; font-size: 20px; color: var(--accent-blue); letter-spacing: 1px; }
        .status-indicator { display: flex; align-items: center; gap: 10px; font-weight: bold; color: var(--accent-red); }
        .blink-dot { width: 12px; height: 12px; background-color: var(--accent-red); border-radius: 50%; animation: blink 1s infinite; }
        .main-content { flex: 1; display: flex; position: relative; overflow: hidden; }
        .pdf-viewer { flex: 1; display: flex; flex-direction: column; background: #33334d; padding: 20px; transition: all 0.5s ease; }
        .pdf-page { flex: 1; background: white; color: #333; border-radius: 4px; padding: 30px; box-shadow: 0 4px 15px rgba(0,0,0,0.2); overflow-y: auto; display: none; }
        .pdf-page.active { display: block; animation: fadeIn 0.3s; }
        .chart-row { display: flex; align-items: center; margin-bottom: 8px; font-size: 12px; }
        .chart-label { width: 95px; color: #555; font-family: monospace; font-weight: bold; }
        .chart-bar-bg { flex: 1; background: #e0e0e0; height: 22px; border-radius: 3px; position: relative; overflow: hidden; box-shadow: inset 0 1px 3px rgba(0,0,0,0.1); }
        .fake-chart-bar { height: 100%; background: #3498db; display: flex; align-items: center; justify-content: flex-end; padding-right: 8px; color: white; font-weight: bold; font-size: 11px; white-space: nowrap; transition: width 0.5s; }
        .fake-log-line { font-family: monospace; font-size: 12px; color: #555; border-bottom: 1px solid #eee; padding: 4px 0; }
        .fake-log-error { color: #e74c3c; font-weight: bold; }
        .pdf-controls { display: flex; justify-content: space-between; align-items: center; margin-top: 15px; background: #222233; padding: 10px 20px; border-radius: 6px; }
        .btn { background: var(--border-color); color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; font-weight: bold; transition: 0.3s; }
        .btn:hover:not(:disabled) { background: #555577; }
        .btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .btn-start { background: var(--accent-blue); color: #000; font-size: 16px; padding: 12px 30px; box-shadow: 0 0 15px rgba(0,210,255,0.4);}
        .btn-start:hover { background: #00b8e6; }
        .quiz-panel { flex: 1; background: #1a1a2e; padding: 40px; display: none; flex-direction: column; overflow-y: auto; border-left: 2px solid var(--border-color); }
        .stage-title { color: var(--accent-blue); font-size: 24px; border-bottom: 1px dashed var(--border-color); padding-bottom: 10px; margin-top: 0;}
        .ai-dialogue { background: rgba(0, 210, 255, 0.1); border-left: 4px solid var(--accent-blue); padding: 20px; border-radius: 0 8px 8px 0; margin-bottom: 30px; font-size: 18px; line-height: 1.6; }
        .options-group { display: flex; flex-direction: column; gap: 15px; }
        .option-btn { background: #2a2a40; border: 2px solid var(--border-color); color: var(--text-main); padding: 20px; border-radius: 8px; text-align: left; font-size: 16px; cursor: pointer; transition: 0.2s; line-height: 1.5; }
        .option-btn:hover { border-color: var(--accent-blue); background: #33334d; }
        .option-btn.correct-answer { background: rgba(0, 230, 118, 0.1) !important; border-color: var(--accent-green) !important; color: var(--accent-green) !important; }
        .option-btn.correct-answer::after { content: ' ✔ (正确答案)'; font-weight: bold; float: right; }
        .option-btn:disabled { opacity: 0.4; cursor: not-allowed; pointer-events: none; }
        .option-btn.correct-answer:disabled { opacity: 1; }
        .quiz-nav { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; padding-bottom: 15px; border-bottom: 1px solid var(--border-color); }
        .btn-nav { background: #33334d; font-size: 14px; padding: 8px 15px; color: #ccc; }
        .btn-nav:hover { background: #555577; color: white; }
        .btn-reset { background: rgba(255, 75, 75, 0.2); color: var(--accent-red); border: 1px solid var(--accent-red); }
        .btn-reset:hover { background: var(--accent-red); color: white; }
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.85); display: none; justify-content: center; align-items: center; z-index: 1000; backdrop-filter: blur(5px); }
        .modal-box { background: var(--panel-bg); border: 2px solid var(--border-color); border-radius: 12px; width: 80%; max-width: 700px; padding: 40px; text-align: center; box-shadow: 0 20px 50px rgba(0,0,0,0.5); animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .modal-icon { font-size: 60px; margin-bottom: 20px; }
        .modal-title { font-size: 28px; margin-top: 0; margin-bottom: 20px; }
        .modal-text { font-size: 18px; line-height: 1.6; color: #ccc; margin-bottom: 30px; text-align: left;}
        .modal-box.error { border-color: var(--accent-red); box-shadow: 0 0 30px rgba(255, 75, 75, 0.2); }
        .modal-box.error .modal-title { color: var(--accent-red); }
        .modal-box.success { border-color: var(--accent-green); box-shadow: 0 0 30px rgba(0, 230, 118, 0.2); }
        .modal-box.success .modal-title { color: var(--accent-green); }
        .btn-modal { background: #444466; font-size: 18px; padding: 12px 40px; }
        .btn-modal:hover { background: #666688; }
        .btn-next { background: var(--accent-blue); color: #000; }
        .btn-next:hover { background: #00b8e6; }
        .loading-spinner { border: 6px solid #33334d; border-top: 6px solid var(--accent-blue); border-radius: 50%; width: 60px; height: 60px; animation: spin 1s linear infinite; margin: 0 auto 20px auto; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes popIn { 0% { opacity: 0; transform: scale(0.8); } 100% { opacity: 1; transform: scale(1); } }
        .hidden { display: none !important; }
    </style>
</head>
<body>
<div class="container">
    <div class="header">
        <h1>[SCADA_Sys] 110kV 智能变电站终端</h1>
        <div class="status-indicator"><div class="blink-dot"></div>SYSTEM HALTED - URGENT TROUBLESHOOTING REQUIRED</div>
    </div>
    <div class="main-content">
        <div class="pdf-viewer" id="pdfViewer">
            <div class="pdf-page active" id="page1">
                <h2 style="border-bottom: 2px solid #333; padding-bottom: 10px;">变电站 24H 运行状态综合图表 (P1/82)</h2>
                <p><strong>[ 机密文档 ]</strong> 包含全厂 12 个变压器节点、45 条总线的热力分布与功率趋势。</p>
                <div style="display:flex; gap: 20px; margin-top: 30px;">
                    <div style="flex:1.2;">
                        <h4>节点功率峰谷图 (MW) - 过去 12 小时</h4>
                        <div class="chart-row"><span class="chart-label">20:00 - 22:00</span><div class="chart-bar-bg"><div class="fake-chart-bar" style="width: 45%; background:#95a5a6;">45.2 MW</div></div></div>
                        <div class="chart-row"><span class="chart-label">22:00 - 00:00</span><div class="chart-bar-bg"><div class="fake-chart-bar" style="width: 32%; background:#95a5a6;">32.8 MW</div></div></div>
                        <div class="chart-row"><span class="chart-label">00:00 - 02:00</span><div class="chart-bar-bg"><div class="fake-chart-bar" style="width: 25%; background:#2ecc71;">25.1 MW (谷值)</div></div></div>
                        <div class="chart-row"><span class="chart-label">02:00 - 04:00</span><div class="chart-bar-bg"><div class="fake-chart-bar" style="width: 28%; background:#2ecc71;">28.5 MW</div></div></div>
                        <div class="chart-row"><span class="chart-label">04:00 - 06:00</span><div class="chart-bar-bg"><div class="fake-chart-bar" style="width: 65%; background:#e67e22;">65.3 MW</div></div></div>
                        <div class="chart-row"><span class="chart-label">06:00 - 08:00</span><div class="chart-bar-bg"><div class="fake-chart-bar" style="width: 94%; background:#e74c3c;">94.7 MW (峰值报警)</div></div></div>
                    </div>
                </div>
            </div>
            <div class="pdf-page" id="page2">
                <h2 style="border-bottom: 2px solid #333; padding-bottom: 10px;">SCADA 原始数据包 Dump (P2/82)</h2>
                <div style="background: #f1f2f6; padding: 15px; height: 350px; overflow: hidden;">
                    <div class="fake-log-line">[08:01:12] INFO  - Node_A4: Temp stable at 32°C.</div>
                    <div class="fake-log-line">[08:01:13] DEBUG - Comm_Link_7: Handshake successful.</div>
                    <div class="fake-log-line">[08:01:15] INFO  - Relay_B2: Status OK.</div>
                    <div class="fake-log-line fake-log-error">[08:01:18] WARN  - Bus_C_Sensor: I_value 505A exceeds threshold (500A).</div>
                    <div class="fake-log-line">[08:01:19] INFO  - Cooler_Fan_1: RPM 1200.</div>
                    <div class="fake-log-line">[08:01:21] DEBUG - Data_Sync: Pushed 24kb to central DB.</div>
                    <div class="fake-log-line">[08:01:22] INFO  - Node_A5: Voltage 10.5kV.</div>
                    <div class="fake-log-line fake-log-error">[08:01:25] WARN  - Bus_C_Control: I_value 15A exceeds threshold (12A).</div>
                </div>
            </div>
            <div class="pdf-page" id="page3">
                <h2 style="border-bottom: 2px solid #333; padding-bottom: 10px;">现场巡检员快速简报 (P3/82)</h2>
                <p>初步结论：现场无物理性短路或过载迹象，疑似系统误判引起的“幽灵跳闸”。</p>
            </div>
            <div class="pdf-page" id="page4">
                <h2 style="border-bottom: 2px solid #333; padding-bottom: 10px;">异常事件频次统计矩阵 (P4/82)</h2>
                <p>Bus C (高精区) 电流越限 (Over-I) 87次，系统评级：高危预警</p>
            </div>
            <div class="pdf-controls">
                <div>
                    <button class="btn" id="btnPrev" onclick="changePage(-1)" disabled>◀ 上一页</button>
                    <span style="margin: 0 15px; font-family: monospace;">Page <span id="pageNum">1</span> / 4</span>
                    <button class="btn" id="btnNext" onclick="changePage(1)">下一页 ▶</button>
                </div>
                <button class="btn btn-start" id="btnStartAI" onclick="startTroubleshooting()">呼叫 AI 助教协助排障</button>
            </div>
        </div>
        <div class="quiz-panel" id="quizPanel">
            <div class="quiz-nav">
                <div>
                    <button class="btn btn-nav" onclick="goBackStage()">↩ 返回上一级</button>
                    <button class="btn btn-nav" id="btnNextStage" onclick="goNextStage()" style="display:none; margin-left:10px; background-color:var(--accent-blue); color:#000;">下一级 ➔</button>
                </div>
                <button class="btn btn-nav btn-reset" onclick="resetSystem()">⟲ 终止排障 (回初始页)</button>
            </div>
            <div id="stage1">
                <h2 class="stage-title">第一阶段：宏观摸排 (信息降噪)</h2>
                <div class="ai-dialogue"><strong>AI 助教：</strong><br>为了最快锁定是谁引发了跳闸，你应该向我输入哪种 Prompt（提示词）？</div>
                <div class="options-group">
                    <button class="option-btn" onclick="handleAnswer(1, 'A', this)">A. “请把这 8000 行代码全部翻译成中文，并总结工作状态。”</button>
                    <button class="option-btn" onclick="handleAnswer(1, 'B', this)">B. “请提取跳闸前带有‘Warning(警告)’的日志，并按节点统计。”</button>
                    <button class="option-btn" onclick="handleAnswer(1, 'C', this)">C. “请分析今天的电网波动图，看看有没有雷击的可能。”</button>
                </div>
            </div>
            <div id="stage2" class="hidden">
                <h2 class="stage-title">第二阶段：中观定锚 (逻辑交叉验证)</h2>
                <div class="ai-dialogue"><strong>AI 助教：</strong><br>总线 C 连续上报了“电流越限”警告。我们必须进行物理数据的交叉验证以核实真伪。</div>
                <div class="options-group">
                    <button class="option-btn" onclick="handleAnswer(2, 'A', this)">A. 调取总线 C 的电压数据和频率。</button>
                    <button class="option-btn" onclick="handleAnswer(2, 'B', this)">B. 调取总线 C 线缆的实时温度传感器数据，以及消耗功率。</button>
                    <button class="option-btn" onclick="handleAnswer(2, 'C', this)">C. 调取电流表的出厂合格证。</button>
                </div>
            </div>
            <div id="stage3" class="hidden">
                <h2 class="stage-title">第三阶段：微观溯源 (误差本质)</h2>
                <div class="ai-dialogue"><strong>AI 助教：</strong><br>物理设备没坏！总线 C 上有两块表：<br>- 1号主路表：真实500A，读数505A (+5A)<br>- 2号精密表：真实10A，读数15A (+5A)<br>你认为是哪个表的假数据导致了系统崩溃跳闸？</div>
                <div class="options-group">
                    <button class="option-btn" onclick="handleAnswer(3, 'A', this)">A. 1号主路电流表。</button>
                    <button class="option-btn" onclick="handleAnswer(3, 'B', this)">B. 2号精密控制表。</button>
                    <button class="option-btn" onclick="handleAnswer(3, 'C', this)">C. 它们一样差，影响相同。</button>
                </div>
            </div>
            <div id="stage4" class="hidden">
                <h2 class="stage-title">第四阶段：最终诊断与处置方案</h2>
                <div class="ai-dialogue"><strong>AI 助教：</strong><br>正确！2号表的相对误差高达 50%！请下达处置指令：</div>
                <div class="options-group">
                    <button class="option-btn" onclick="handleAnswer(4, 'A', this)">A. “均存在5A绝对误差，均已损坏。立即全线停机更换。”</button>
                    <button class="option-btn" onclick="handleAnswer(4, 'B', this)">B. “2号表相对误差高达50%，在系统中屏蔽其信号并加急更换。1号暂可服役。”</button>
                    <button class="option-btn" onclick="handleAnswer(4, 'C', this)">C. “跳闸算法过于敏感，建议调高所有报警阈值。”</button>
                </div>
            </div>
            <div id="stageEnd" class="hidden">
                <h2 class="stage-title" style="color: var(--accent-green);">排障成功：系统恢复</h2>
                <div class="ai-dialogue" style="border-color: var(--accent-green); background: rgba(0, 230, 118, 0.1);"><strong>系统通告：</strong><br>基于工程师的精准判断，已在软件中对“2号精密控制表”进行参数屏蔽与修正。紧急跳闸保护已解除，全厂恢复供电！</div>
                <div style="background: #1a1a2e; padding: 25px; border-radius: 8px; border-left: 4px solid var(--accent-blue); margin-top: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">
                    <h3 style="margin-top: 0; color: var(--accent-blue); font-size: 20px;">【最后的总结：核心知识点归纳】</h3>
                    <p style="font-size: 16px; line-height: 1.8; margin-bottom: 0; color: #e0e0e0;">
                        在本次排障实录中，我们验证了一个重要的工程定则：<strong>绝对误差具有极强的欺骗性</strong>。<br><br>
                        评价仪表准不准、对系统破坏力有多大，绝不能单看绝对误差的大小，必须计算<strong>“相对误差”</strong>（绝对误差 ÷ 真实值 × 100%）。<br><br>
                        2号精密控制表虽然仅有 5A 的偏差，但因其工作基数极小，产生了高达 50% 的致命相对误差，最终诱发了中控算法的紧急跳闸保护！
                    </p>
                </div>
            </div>
        </div>
    </div>
</div>
<div class="modal-overlay" id="aiModal">
    <div class="modal-box error" id="modalBox">
        <div class="modal-icon" id="modalIcon">⚠️</div>
        <h2 class="modal-title" id="modalTitle">思考方向偏离</h2>
        <div class="modal-text" id="modalText">这里是提示内容...</div>
        <button class="btn btn-modal" id="modalBtn" onclick="closeModal()">重新思考</button>
    </div>
</div>
<div class="modal-overlay" id="loadingOverlay" style="z-index: 2000;">
    <div class="modal-box" style="border-color: var(--accent-blue); box-shadow: 0 0 30px rgba(0, 210, 255, 0.2);">
        <div class="loading-spinner"></div>
        <h2 class="modal-title" style="color: var(--accent-blue);">AI 助教接入中...</h2>
        <div class="modal-text" style="text-align: center; color: #e0e0e0;">正在读取 SCADA 运行日志...</div>
    </div>
</div>
<script>
    let currentPage = 1; const totalPages = 4; let activeStage = 1; let maxStageReached = 1; 
    function changePage(delta) {
        document.getElementById('page' + currentPage).classList.remove('active');
        currentPage += delta;
        document.getElementById('page' + currentPage).classList.add('active');
        document.getElementById('pageNum').innerText = currentPage;
        document.getElementById('btnPrev').disabled = (currentPage === 1);
        document.getElementById('btnNext').disabled = (currentPage === totalPages); 
    }
    function startTroubleshooting() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        loadingOverlay.style.display = 'flex';
        setTimeout(() => {
            loadingOverlay.style.display = 'none';
            document.getElementById('pdfViewer').style.flex = "0.7"; 
            document.getElementById('quizPanel').style.display = "flex";
            document.getElementById('btnStartAI').style.display = "none";
            activeStage = 1; maxStageReached = 1; updateNavButtons();
            for(let i=1; i<=4; i++) document.getElementById('stage' + i).classList.add('hidden');
            document.getElementById('stageEnd').classList.add('hidden');
            document.getElementById('stage1').classList.remove('hidden');
        }, 1500); 
    }
    function goBackStage() {
        if (activeStage > 1 && activeStage <= 4) {
            document.getElementById('stage' + activeStage).classList.add('hidden');
            activeStage--;
            document.getElementById('stage' + activeStage).classList.remove('hidden');
        } else if (activeStage === 5) {
            document.getElementById('stageEnd').classList.add('hidden');
            activeStage = 4;
            document.getElementById('stage' + activeStage).classList.remove('hidden');
        } else if (activeStage === 1) {
            document.getElementById('pdfViewer').style.flex = "1";
            document.getElementById('quizPanel').style.display = "none";
            document.getElementById('btnStartAI').style.display = "inline-block";
        }
        updateNavButtons();
    }
    function goNextStage() {
        if (activeStage < maxStageReached) {
            document.getElementById('stage' + activeStage).classList.add('hidden');
            activeStage++;
            if (activeStage <= 4) document.getElementById('stage' + activeStage).classList.remove('hidden');
            else document.getElementById('stageEnd').classList.remove('hidden');
            updateNavButtons();
        }
    }
    function updateNavButtons() { document.getElementById('btnNextStage').style.display = activeStage < maxStageReached ? "inline-block" : "none"; }
    function handleAnswer(stage, selectedOption, btnElement) {
        const modal = document.getElementById('aiModal'); const box = document.getElementById('modalBox');
        const icon = document.getElementById('modalIcon'); const title = document.getElementById('modalTitle');
        const text = document.getElementById('modalText'); const btn = document.getElementById('modalBtn');
        let isCorrect = false; let promptText = "";
        if (stage === 1) {
            if (selectedOption === 'B') { isCorrect = true; promptText = "非常精准的指令！这就是 AI 最擅长的数据清洗。成功将目标锁定到了总线 C！"; }
            else promptText = "面对海量数据时，第一步应该是‘过滤降噪’而不是盲目阅读或归因外界。";
        } else if (stage === 2) {
            if (selectedOption === 'B') { isCorrect = true; promptText = "工程逻辑满分！数据表明线缆温度正常，说明电流表在撒谎！"; }
            else promptText = "我们需要确认的是‘当前电缆到底有没有发烧过载’，请找能反映物理负荷的数据。";
        } else if (stage === 3) {
            if (selectedOption === 'B') { isCorrect = true; promptText = "完全正确！2号表的相对误差高达 50% !"; }
            else promptText = "别急下定论！请计算它们的相对误差（绝对误差 ÷ 真实值）。";
        } else if (stage === 4) {
            if (selectedOption === 'B') { isCorrect = true; promptText = "出色的决断！精准定位，合理处置。指令已下发！"; }
            else promptText = "要么盲目扩大了维修范围，要么掩盖了危险（修改阈值），请重选。";
        }
        if (isCorrect) {
            box.className = "modal-box success"; icon.innerText = "🎯"; title.innerText = stage === 4 ? "排障成功！" : "分析正确！推进排查"; 
            text.innerText = promptText; btn.innerText = stage === 4 ? "查看最后的总结" : "进入下一阶段"; 
            btn.className = "btn btn-modal btn-next";
            btn.onclick = () => {
                btnElement.classList.add('correct-answer');
                const siblings = btnElement.parentElement.querySelectorAll('.option-btn');
                siblings.forEach(b => b.disabled = true); closeModal();
                document.getElementById('stage' + stage).classList.add('hidden');
                if (stage < 4) { document.getElementById('stage' + (stage + 1)).classList.remove('hidden'); activeStage = stage + 1; } 
                else { 
                    document.getElementById('stageEnd').classList.remove('hidden'); activeStage = 5; 
                    if (window.parent) window.parent.postMessage({ type: 'MODULE_COMPLETED', module: '智能工厂配电系统故障诊断' }, '*');
                }
                if (activeStage > maxStageReached) maxStageReached = activeStage; updateNavButtons();
            };
        } else {
            box.className = "modal-box error"; icon.innerText = "⚠️"; title.innerText = "AI 引导提示：请重新思考"; text.innerText = promptText;
            btn.innerText = "返回重选"; btn.className = "btn btn-modal"; btn.onclick = closeModal;
        }
        modal.style.display = "flex";
    }
    function closeModal() { document.getElementById('aiModal').style.display = "none"; }
    function resetSystem() { location.reload(); }
</script>
</body>
</html>`;

// 2. 第一章：电压表出厂校验沙盘
const voltmeterSimHTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>电气测量技术 - 误差闯关实战测验</title>
    <style>
        body { font-family: ui-sans-serif, system-ui, sans-serif; background: transparent; color: #0f172a; display: flex; justify-content: center; margin: 0; padding: 0; }
        .container { width: 100%; max-width: 1100px; padding: 20px; box-sizing: border-box; }
        .header { text-align: left; margin-bottom: 24px; border-bottom: 1px solid #e2e8f0; padding-bottom: 16px; }
        .header h1 { margin:0; color:#0f172a; font-size: 24px; font-weight: 700; }
        .layout { display: flex; gap: 24px; margin-bottom: 30px; }
        .left-panel { flex: 1.2; display: flex; flex-direction: column; gap: 20px; }
        .right-panel { flex: 1; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
        .circuit-box { border: 1px solid #e2e8f0; border-radius: 16px; padding: 20px; background: #ffffff; position: relative; }
        .circuit-title { margin-top: 0; font-size: 16px; color: #334155; font-weight: 600; margin-bottom: 16px; }
        .svg-circuit { width: 100%; height: 180px; background: #f8fafc; border-radius: 8px; border: 1px solid #f1f5f9; }
        .wire { fill: none; stroke: #475569; stroke-width: 3; }
        .component { fill: #ffffff; stroke: #475569; stroke-width: 3; }
        .voltmeter-icon { fill: #ccfbf1; stroke: #0d9488; stroke-width: 3; cursor: pointer; transition: 0.2s; }
        .v-text { font-family: sans-serif; font-weight: bold; font-size: 20px; fill: #0d9488; pointer-events: none; }
        .label { font-family: sans-serif; font-size: 15px; fill: #475569; font-weight: bold; }
        .tooltip { position: absolute; background: #1e293b; color: white; padding: 12px 18px; border-radius: 8px; font-size: 14px; top: 50%; left: 50%; transform: translate(-50%, -50%); display: none; z-index: 10; }
        table { width: 100%; border-collapse: collapse; font-size: 14px; text-align: center; margin-top: 10px; }
        th, td { border-bottom: 1px solid #e2e8f0; padding: 12px 8px; }
        th { background-color: #f8fafc; color: #475569; font-weight: 600; border-top: 1px solid #e2e8f0; }
        .error-col { font-family: monospace; font-weight: bold; }
        .action-area { text-align: center; margin: 10px 0; }
        .btn-move { padding: 12px 24px; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; color: white; background-color: #0d9488; width: 100%; }
        .meter-container { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 20px; text-align: center; display: none; }
        .meter-display { font-family: monospace; font-size: 42px; font-weight: bold; color: #0d9488; background: #f0fdfa; padding: 10px 30px; border-radius: 8px; border: 1px dashed #5eead4; display: inline-block; margin-top: 10px; }
        #quizArea { display: none; background: #ffffff; border: 2px solid #0d9488; border-radius: 16px; padding: 30px; margin-top: 20px; }
        .quiz-header { color: #0f766e; font-size: 20px; font-weight: 700; margin-top: 0; margin-bottom: 24px; border-bottom: 1px solid #e2e8f0; padding-bottom: 16px;}
        .question-box { background: #f8fafc; border-left: 4px solid #0d9488; border-radius: 8px; padding: 24px; margin-bottom: 24px; display: none; transition: all 0.5s ease; border: 1px solid #e2e8f0; border-left-width: 4px; }
        .question-box.active { display: block; animation: slideIn 0.5s ease; }
        .question-box.locked { opacity: 0.6; pointer-events: none; filter: grayscale(50%); border-left-color: #94a3b8; } 
        .q-text { font-size: 16px; font-weight: 600; color: #1e293b; margin-top: 0; margin-bottom: 16px; }
        .input-group { font-size: 15px; margin-bottom: 16px; color: #475569; }
        .input-group input[type="number"] { width: 80px; height: 36px; font-size: 16px; text-align: center; border: 1px solid #cbd5e1; border-radius: 6px; color: #0d9488; font-weight: bold; margin: 0 10px; outline: none; }
        .radio-group label { display: block; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 16px; margin-bottom: 12px; font-size: 15px; color: #334155; cursor: pointer; }
        .radio-group input[type="radio"] { accent-color: #0d9488; transform: scale(1.2); margin-right: 12px; }
        .btn-submit { background-color: #0d9488; padding: 10px 24px; font-size: 15px; margin-top: 10px; border: none; border-radius: 8px; color: white; font-weight: 600; cursor: pointer; }
        .success-mark { color: #059669; font-size: 16px; font-weight: bold; display: none; margin-left: 15px; }
        #resultPanel { background: #f0fdfa; border-left: 4px solid #14b8a6; padding: 24px; margin-top: 30px; border-radius: 8px; display: none; border: 1px solid #ccfbf1; border-left-width: 4px;}
        .result-title { color: #0f766e; font-size: 20px; font-weight: 700; margin-top: 0; }
        .formula { font-family: monospace; font-size: 14px; margin: 12px 0; background: #ffffff; padding: 12px; border-radius: 6px; border: 1px solid #99f6e4; color: #0f766e; }
        @keyframes slideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.85); display: none; justify-content: center; align-items: center; z-index: 1000; backdrop-filter: blur(5px); }
        .modal-box { background: #2a2a40; border: 2px solid #444466; border-radius: 12px; width: 80%; max-width: 700px; padding: 40px; text-align: center; box-shadow: 0 20px 50px rgba(0,0,0,0.5); color: #e0e0e0; }
        .modal-icon { font-size: 60px; margin-bottom: 20px; }
        .modal-title { font-size: 28px; margin-top: 0; margin-bottom: 20px; }
        .modal-text { font-size: 18px; line-height: 1.6; color: #ccc; margin-bottom: 30px; text-align: left; white-space: pre-wrap; }
        .modal-box.error { border-color: #ff4b4b; box-shadow: 0 0 30px rgba(255, 75, 75, 0.2); }
        .modal-box.error .modal-title { color: #ff4b4b; }
        .modal-box.warning { border-color: #f39c12; box-shadow: 0 0 30px rgba(243, 156, 18, 0.2); }
        .modal-box.warning .modal-title { color: #f39c12; }
        .btn-modal { background: #444466; color: white; border: none; font-size: 18px; padding: 12px 40px; border-radius: 4px; cursor: pointer; font-weight: bold; }
    </style>
</head>
<body>

<div class="modal-overlay" id="aiModal">
    <div class="modal-box error" id="modalBox">
        <div class="modal-icon" id="modalIcon">⚠️</div>
        <h2 class="modal-title" id="modalTitle">思考方向偏离</h2>
        <div class="modal-text" id="modalText">提示内容</div>
        <button class="btn-modal" onclick="document.getElementById('aiModal').style.display='none'">返回重选</button>
    </div>
</div>

<div class="container">
    <div class="header">
        <h1>任务：提取电路信息并完成工程师闯关测验</h1>
    </div>

    <div class="layout">
        <div class="left-panel">
            <div class="circuit-box" id="box-circuit1">
                <h3 class="circuit-title">标定测试电路（点击电压表查看量程铭牌）</h3>
                <div class="tooltip" id="meterTooltip"><strong>仪表铭牌</strong><br>量程：200 V</div>
                <svg class="svg-circuit" viewBox="0 0 400 180">
                    <circle cx="50" cy="90" r="20" class="component" />
                    <text x="44" y="96" class="label">G</text>
                    <path d="M 50 70 L 50 30 L 250 30 L 250 60" class="wire" />
                    <path d="M 50 110 L 50 150 L 250 150 L 250 120" class="wire" />
                    <rect x="230" y="60" width="40" height="60" class="component" />
                    <text x="280" y="95" class="label">负载</text>
                    <path d="M 150 30 L 150 70" class="wire" />
                    <path d="M 150 150 L 150 110" class="wire" />
                    <circle cx="150" cy="90" r="20" class="voltmeter-icon" id="svgMeter1" onclick="showTooltip()" />
                    <text x="143" y="97" class="v-text">V</text>
                </svg>
            </div>

            <div class="circuit-box" id="box-circuit2">
                <h3 class="circuit-title">现场测量电路</h3>
                <svg class="svg-circuit" viewBox="0 0 400 180">
                    <circle cx="50" cy="90" r="20" class="component" />
                    <text x="44" y="96" class="label">E</text>
                    <text x="25" y="60" class="label" fill="#0d9488" font-size="16px">E = 150 V</text> 
                    <path d="M 50 70 L 50 30 L 250 30 L 250 60" class="wire" />
                    <path d="M 50 110 L 50 150 L 250 150 L 250 120" class="wire" />
                    <rect x="230" y="60" width="40" height="60" class="component" />
                    <path d="M 150 30 L 150 70" class="wire" stroke-dasharray="4" />
                    <path d="M 150 150 L 150 110" class="wire" stroke-dasharray="4" />
                    <g id="svgMeter2" style="display:none;">
                        <circle cx="150" cy="90" r="20" fill="#ccfbf1" stroke="#0d9488" stroke-width="3" />
                        <text x="143" y="97" class="v-text">V</text>
                    </g>
                </svg>
            </div>

            <div class="action-area">
                <button class="btn-move" id="moveBtn" onclick="moveMeter()">断开电路1，将电压表接入现场电路</button>
            </div>

            <div class="meter-container" id="realTimeMeter">
                <h3 style="margin-top:0; color:#0f766e; font-size: 18px;">现场实时读数</h3>
                <div class="meter-display" id="displayValue">--- V</div>
            </div>
        </div>

        <div class="right-panel">
            <h3 style="margin-top:0; color:#1e293b; font-size: 16px;">全量程出厂测试记录</h3>
            <table>
                <tr><th>序号</th><th>真实值</th><th>测量值</th><th>绝对误差</th></tr>
                <tr><td>1</td><td>20.0 V</td><td>20.3 V</td><td class="error-col" style="color:#0ea5e9;">+0.3 V</td></tr>
                <tr><td>2</td><td>60.0 V</td><td>60.8 V</td><td class="error-col" style="color:#0ea5e9;">+0.8 V</td></tr>
                <tr><td>3</td><td>100.0 V</td><td>101.5 V</td><td class="error-col" style="color:#0ea5e9;">+1.5 V</td></tr>
                <tr><td>4</td><td>140.0 V</td><td>142.0 V</td><td class="error-col" style="color:#0ea5e9;">+2.0 V</td></tr>
                <tr><td>5</td><td>180.0 V</td><td>180.5 V</td><td class="error-col" style="color:#0ea5e9;">+0.5 V</td></tr>
                <tr><td>6</td><td>200.0 V</td><td>198.6 V</td><td class="error-col" style="color:#f59e0b;">-1.4 V</td></tr>
            </table>
        </div>
    </div>

    <div id="quizArea">
        <h2 class="quiz-header">🏆 工程师现场考核 (通关解锁制)</h2>

        <div class="question-box active" id="q1-box">
            <p class="q-text">【第一关】请计算该电压表的：</p>
            <div class="input-group">最大引用误差 (γm) = <input type="number" id="ans_fiducial" step="0.1"> %</div>
            <div class="input-group">本次测量的绝对误差 (Δ) = <input type="number" id="ans_absolute" step="0.1"> V</div>
            <button class="btn-submit" id="btn-q1" onclick="checkQ1()">验证并提交</button>
            <span class="success-mark" id="mark-q1">✔ 回答正确，已锁定！</span>
        </div>

        <div class="question-box" id="q2-box">
            <p class="q-text">【第二关】对比：如果用另一块电压表测量另一处 20V 的电压，其绝对误差为 +0.5V。请问哪个表测得更准一些？</p>
            <div class="radio-group">
                <label><input type="radio" name="q2" value="current"> A. 本实验中的电压表 (150V读数，误差1V)</label>
                <label><input type="radio" name="q2" value="other"> B. 另一块电压表 (20V读数，误差0.5V)</label>
            </div>
            <button class="btn-submit" id="btn-q2" onclick="checkQ2()">验证并提交</button>
            <span class="success-mark" id="mark-q2">✔ 回答正确，已锁定！</span>
        </div>

        <div class="question-box" id="q3-box">
            <p class="q-text">【终极关卡】造成本实验中这种偏差的原因，最有可能属于以下哪种？</p>
            <div class="radio-group">
                <label><input type="radio" name="q3" value="random"> A. 随机误差</label>
                <label><input type="radio" name="q3" value="systematic"> B. 系统误差</label>
                <label><input type="radio" name="q3" value="gross"> C. 粗大误差</label>
            </div>
            <button class="btn-submit" id="btn-q3" onclick="checkQ3()">提交终极答案</button>
            <span class="success-mark" id="mark-q3">✔ 完全通关！</span>
        </div>

        <div id="resultPanel">
            <h2 class="result-title">🎉 恭喜工程师！考核全部通过！</h2>
            <p style="font-size: 15px; margin-bottom: 5px;"><strong>【核心知识点归纳与解析】</strong></p>
            <div class="formula">
                最大引用误差 = (历史最大绝对误差 2V / 量程 200V) × 100% = <strong>1%</strong><br>
                本次绝对误差 = 测量值 151V - 真实值 150V = <strong>1V</strong>
            </div>
        </div>
    </div>
</div>

<script>
    function showAlert(msg) {
        const modal = document.getElementById('aiModal');
        const box = document.getElementById('modalBox');
        const icon = document.getElementById('modalIcon');
        const title = document.getElementById('modalTitle');
        const text = document.getElementById('modalText');
        
        let isError = msg.includes('❌');
        box.className = isError ? "modal-box error" : "modal-box warning";
        icon.innerText = "⚠️";
        title.innerText = isError ? "AI 引导提示：请重新思考" : "系统提示";
        text.innerText = msg.replace(/❌ |⚠️ /g, '');
        
        modal.style.display = "flex";
    }

    function showTooltip() {
        document.getElementById('meterTooltip').style.display = 'block';
        setTimeout(() => document.getElementById('meterTooltip').style.display = 'none', 3000);
    }

    function moveMeter() {
        document.getElementById('svgMeter1').style.display = 'none'; 
        document.getElementById('svgMeter2').style.display = 'block'; 
        document.getElementById('moveBtn').style.display = 'none';
        document.getElementById('realTimeMeter').style.display = 'block';
        
        let tempValue = 0;
        const interval = setInterval(() => {
            tempValue += 15;
            if (tempValue >= 151.0) {
                tempValue = 151.0;
                clearInterval(interval);
                document.getElementById('quizArea').style.display = 'block';
                document.getElementById('quizArea').scrollIntoView({ behavior: "smooth", block: "start" });
            }
            document.getElementById('displayValue').innerText = tempValue.toFixed(1) + " V";
        }, 50);
    }

    function lockQuestion(qId) {
        document.getElementById(qId + '-box').classList.add('locked');
        document.getElementById('btn-' + qId).style.display = 'none';
        document.getElementById('mark-' + qId).style.display = 'inline-block';
    }

    function checkQ1() {
        const f = parseFloat(document.getElementById('ans_fiducial').value);
        const a = parseFloat(document.getElementById('ans_absolute').value);
        if (isNaN(f) || isNaN(a)) return showAlert("⚠️ 请先填入数字答案再提交！");
        if (f !== 1 || a !== 1) return showAlert("❌ 第一关计算有误！\\n\\n1. 最大引用误差 = 最大的绝对误差 ÷ 仪表的满量程(200V)\\n2. 本次绝对误差 = 测量值 - 真实值");
        
        lockQuestion('q1');
        document.getElementById('q2-box').classList.add('active');
    }

    function checkQ2() {
        const opt = document.querySelector('input[name="q2"]:checked');
        if (!opt) return showAlert("⚠️ 请先选择一个选项！");
        if (opt.value !== "current") return showAlert("❌ 判断失误！评价准不准，必须计算“相对误差”（误差 ÷ 真实值）。");
        
        lockQuestion('q2');
        document.getElementById('q3-box').classList.add('active');
    }

    function checkQ3() {
        const opt = document.querySelector('input[name="q3"]:checked');
        if (!opt) return showAlert("⚠️ 请先选择一个选项！");
        if (opt.value !== "systematic") {
            opt.checked = false;
            return showAlert("❌ 选项错误！这种有规律的固有偏差，属于典型系统误差。");
        }
        
        lockQuestion('q3');
        document.getElementById('resultPanel').style.display = 'block';
        
        if (window.parent) {
            window.parent.postMessage({ type: 'MODULE_COMPLETED', module: '电压表出厂校验闯关' }, '*');
        }
    }
</script>
</body>
</html>`;

// 3. 第四章：用户上传的 SVG 互动沙盘
const frequencyMeterHTMLTemplate = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PAGE_TITLE</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; }
        .pointer-anim { transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
        .math-text { font-family: "Times New Roman", Times, serif; font-style: italic; font-size: 18px; }
        .math-sub { font-size: 12px; }
        input[type=range] { -webkit-appearance: none; width: 100%; background: transparent; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; height: 24px; width: 24px; border-radius: 50%; background: #3b82f6; cursor: pointer; margin-top: -10px; box-shadow: 0 2px 4px rgba(0,0,0,0.2); }
        input[type=range]::-webkit-slider-runnable-track { width: 100%; height: 6px; cursor: pointer; background: #e5e7eb; border-radius: 3px; }
        input[type=range]:focus { outline: none; }
    </style>
</head>
<body class="bg-gray-100 min-h-screen py-8 overflow-y-auto">
<div class="max-w-5xl mx-auto px-4">
    <header class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">PAGE_TITLE</h1>
        <p class="text-gray-500">拖动滑块调节频率，观察各环节“示波器”中的波形变化及表头指针反应</p>
    </header>
    <div class="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div class="w-full overflow-x-auto border-2 border-gray-100 rounded-xl mb-6 relative bg-gray-50/50">
            <svg viewBox="0 -70 850 460" xmlns="http://www.w3.org/2000/svg" class="w-full h-auto min-w-[700px]">
                <defs>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="1" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                    <g id="scope-box">
                        <rect x="0" y="0" width="60" height="40" fill="#0f172a" rx="4" stroke="#334155" stroke-width="2"/>
                        <line x1="0" y1="20" x2="60" y2="20" stroke="#1e293b" stroke-width="1"/>
                    </g>
                    <g id="resistor"><rect x="-20" y="-8" width="40" height="16" fill="white" stroke="#1f2937" stroke-width="2"/></g>
                    <g id="cap-v"><rect x="-15" y="-10" width="30" height="20" fill="white" stroke="none"/><line x1="-15" y1="-5" x2="15" y2="-5" stroke="#1f2937" stroke-width="2"/><line x1="-15" y1="5" x2="15" y2="5" stroke="#1f2937" stroke-width="2"/></g>
                    <g id="cap-elec-v"><rect x="-20" y="-12" width="40" height="24" fill="white" stroke="none"/><line x1="-15" y1="-5" x2="15" y2="-5" stroke="#1f2937" stroke-width="2"/><path d="M -15 5 Q 0 15 15 5" fill="none" stroke="#1f2937" stroke-width="2"/><text x="-25" y="-3" font-size="14" font-family="Arial" font-weight="bold" fill="#1f2937">+</text></g>
                    <g id="zener-down"><rect x="-15" y="-20" width="30" height="40" fill="white" stroke="none"/><polygon points="0,10 -10,-10 10,-10" fill="white" stroke="#1f2937" stroke-width="2"/><polyline points="-10,5 -10,10 10,10 10,15" fill="none" stroke="#1f2937" stroke-width="2"/></g>
                    <g id="zener-up"><rect x="-15" y="-20" width="30" height="40" fill="white" stroke="none"/><polygon points="0,-10 -10,10 10,10" fill="white" stroke="#1f2937" stroke-width="2"/><polyline points="-10,-5 -10,-10 10,-10 10,-15" fill="none" stroke="#1f2937" stroke-width="2"/></g>
                    <g id="diode-up"><rect x="-15" y="-20" width="30" height="40" fill="white" stroke="none"/><polygon points="0,-10 -10,10 10,10" fill="white" stroke="#1f2937" stroke-width="2"/><line x1="-10" y1="-10" x2="10" y2="-10" stroke="#1f2937" stroke-width="2"/></g>
                    <g id="diode-down"><rect x="-15" y="-20" width="30" height="40" fill="white" stroke="none"/><polygon points="0,10 -10,-10 10,-10" fill="white" stroke="#1f2937" stroke-width="2"/><line x1="-10" y1="10" x2="10" y2="10" stroke="#1f2937" stroke-width="2"/></g>
                    <g id="diode-right"><rect x="-20" y="-15" width="40" height="30" fill="white" stroke="none"/><polygon points="10,0 -10,-10 -10,10" fill="white" stroke="#1f2937" stroke-width="2"/><line x1="10" y1="-10" x2="10" y2="10" stroke="#1f2937" stroke-width="2"/></g>
                    <g id="var-resistor"><rect x="-20" y="-8" width="40" height="16" fill="white" stroke="#1f2937" stroke-width="2"/><line x1="-15" y1="15" x2="15" y2="-15" stroke="#1f2937" stroke-width="2"/><polygon points="15,-15 8,-15 15,-8" fill="#1f2937"/></g>
                    <circle id="node" cx="0" cy="0" r="3" fill="#1f2937"/>
                </defs>

                <g stroke="#1f2937" stroke-width="2">
                    <line x1="60" y1="60" x2="760" y2="60"/>
                    <line x1="60" y1="260" x2="760" y2="260"/>
                    <line x1="180" y1="60" x2="180" y2="260"/>
                    <line x1="280" y1="60" x2="280" y2="260"/>
                    <line x1="280" y1="160" x2="760" y2="160"/>
                    <line x1="440" y1="160" x2="440" y2="260"/>
                    <line x1="520" y1="160" x2="520" y2="260"/>
                    <line x1="760" y1="60" x2="760" y2="260"/>
                </g>

                <use href="#node" x="180" y="60"/> <use href="#node" x="280" y="60"/> <use href="#node" x="760" y="60"/>
                <use href="#node" x="180" y="260"/> <use href="#node" x="280" y="260"/> <use href="#node" x="440" y="260"/>
                <use href="#node" x="520" y="260"/> <use href="#node" x="760" y="260"/> <use href="#node" x="280" y="160"/>
                <use href="#node" x="440" y="160"/> <use href="#node" x="520" y="160"/> <use href="#node" x="760" y="160"/>

                <circle cx="60" cy="60" r="4" fill="white" stroke="#1f2937" stroke-width="2"/>
                <circle cx="60" cy="260" r="4" fill="white" stroke="#1f2937" stroke-width="2"/>

                <use href="#resistor" transform="translate(120, 60)"/>
                <use href="#zener-down" transform="translate(180, 110)"/>
                <use href="#zener-up" transform="translate(180, 210)"/>
                <use href="#cap-v" transform="translate(280, 110)"/>
                <use href="#diode-up" transform="translate(280, 210)"/>
                <use href="#diode-right" transform="translate(360, 160)"/>
                <use href="#cap-elec-v" transform="translate(440, 210)"/>
                
                <g transform="translate(520, 210)">
                    <rect x="-22" y="-22" width="44" height="44" fill="#f8fafc" stroke="none"/>
                    <circle cx="0" cy="0" r="20" fill="white" stroke="#1f2937" stroke-width="2"/>
                    <g id="meter-pointer" class="pointer-anim" transform="rotate(-40)">
                        <line x1="0" y1="4" x2="0" y2="-15" stroke="#f43f5e" stroke-width="2"/>
                        <polygon points="0,-18 -3,-12 3,-12" fill="#f43f5e"/>
                    </g>
                    <circle cx="0" cy="4" r="2" fill="#1f2937"/>
                </g>

                <use href="#var-resistor" transform="translate(610, 160)"/>
                <use href="#resistor" transform="translate(690, 160)"/>
                <use href="#diode-down" transform="translate(760, 110)"/>
                <use href="#cap-elec-v" transform="translate(760, 210)"/>

                <g stroke="#1f2937" stroke-width="1.5">
                    <line x1="480" y1="195" x2="480" y2="225"/>
                    <polygon points="480,230 476,222 484,222" fill="#1f2937" stroke="none"/>
                    <line x1="560" y1="225" x2="560" y2="195"/>
                    <polygon points="560,190 556,198 564,198" fill="#1f2937" stroke="none"/>
                </g>

                <g class="math-text" fill="#1f2937">
                    <text x="35" y="65">A</text><text x="35" y="265">B</text>
                    <text x="110" y="40">R<tspan class="math-sub" dy="4">0</tspan></text>
                    <text x="140" y="115">VS<tspan class="math-sub" dy="4">1</tspan></text>
                    <text x="140" y="215">VS<tspan class="math-sub" dy="4">2</tspan></text>
                    <text x="235" y="115">C<tspan class="math-sub" dy="4">0</tspan></text>
                    <text x="235" y="215">VD<tspan class="math-sub" dy="4">1</tspan></text>
                    <text x="350" y="135">VD<tspan class="math-sub" dy="4">2</tspan></text>
                    <text x="400" y="215">C<tspan class="math-sub" dy="4">1</tspan></text>
                    <text x="495" y="220">i<tspan class="math-sub" dy="4">1</tspan></text>
                    <text x="575" y="220">i<tspan class="math-sub" dy="4">2</tspan></text>
                    <text x="600" y="135">R<tspan class="math-sub" dy="4">1</tspan></text>
                    <text x="680" y="135">R<tspan class="math-sub" dy="4">2</tspan></text>
                    <text x="785" y="115">VD<tspan class="math-sub" dy="4">3</tspan></text>
                    <text x="785" y="215">C<tspan class="math-sub" dy="4">2</tspan></text>
                </g>

                <text x="260" y="430" font-family="sans-serif" font-weight="bold" font-size="20px" fill="#4b5563">图 4-1<tspan dx="15">微分型变换式频率表原理图（带各点波形指示）</tspan></text>

                <g>
                    <polyline points="45,-20 60,60" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4 2"/>
                    <use href="#scope-box" x="15" y="-60"/>
                    <path id="wave-input" transform="translate(20, -55)" stroke="#60a5fa" fill="none" stroke-width="1.5" filter="url(#glow)"/>
                    <text x="45" y="-65" font-size="12" font-weight="bold" fill="#60a5fa" text-anchor="middle">输入正弦波</text>
                </g>
                <g>
                    <polyline points="180,-20 180,60" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4 2"/>
                    <use href="#scope-box" x="150" y="-60"/>
                    <path id="wave-square" transform="translate(155, -55)" stroke="#818cf8" fill="none" stroke-width="1.5" filter="url(#glow)"/>
                    <text x="180" y="-65" font-size="12" font-weight="bold" fill="#818cf8" text-anchor="middle">① 方波</text>
                </g>
                <g>
                    <polyline points="280,310 280,160" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4 2"/>
                    <use href="#scope-box" x="250" y="310"/>
                    <path id="wave-diff" transform="translate(255, 315)" stroke="#34d399" fill="none" stroke-width="1.5" filter="url(#glow)"/>
                    <text x="280" y="365" font-size="12" font-weight="bold" fill="#34d399" text-anchor="middle">② 微分尖脉冲</text>
                </g>
                <g>
                    <polyline points="440,120 440,160" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4 2"/>
                    <use href="#scope-box" x="410" y="80"/>
                    <path id="wave-rect" transform="translate(415, 85)" stroke="#fbbf24" fill="none" stroke-width="1.5" filter="url(#glow)"/>
                    <text x="440" y="75" font-size="12" font-weight="bold" fill="#fbbf24" text-anchor="middle">③ 整流单向脉冲</text>
                </g>
                <g>
                    <polyline points="520,310 520,260" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4 2"/>
                    <use href="#scope-box" x="490" y="310"/>
                    <path id="wave-meter" transform="translate(495, 315)" stroke="#fb7185" fill="none" stroke-width="2" filter="url(#glow)"/>
                    <text x="520" y="365" font-size="12" font-weight="bold" fill="#fb7185" text-anchor="middle">④ 指示直流 i1</text>
                </g>
                <g>
                    <polyline points="690,120 690,160" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4 2"/>
                    <use href="#scope-box" x="660" y="80"/>
                    <path id="wave-bias" transform="translate(665, 85)" stroke="#c084fc" fill="none" stroke-width="2" filter="url(#glow)"/>
                    <text x="690" y="75" font-size="12" font-weight="bold" fill="#c084fc" text-anchor="middle">⑤ 偏置直流 i2</text>
                </g>
            </svg>
        </div>

        <div class="bg-blue-50 p-5 rounded-xl border border-blue-100 flex flex-col md:flex-row items-center justify-between gap-6">
            <div class="flex-shrink-0">
                <h3 class="font-bold text-blue-900 text-lg">调节输入信号频率 (f)</h3>
                <p class="text-sm text-blue-700">实时观察电路各节点波形疏密变化及表头电平</p>
            </div>
            <div class="flex-grow w-full md:w-auto flex items-center gap-4">
                <span class="text-gray-500 font-medium">0 Hz</span>
                <input type="range" id="freq-slider" min="0" max="100" value="0" class="flex-grow">
                <span class="text-gray-500 font-medium">100 Hz</span>
            </div>
            <div class="flex-shrink-0 bg-blue-600 text-white px-4 py-2 rounded-lg font-mono text-xl w-32 text-center shadow-md">
                <span id="freq-value">0</span> Hz
            </div>
        </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-white rounded-xl shadow p-6 border-t-4 border-indigo-400">
            <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <span class="bg-indigo-100 text-indigo-700 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">1</span>
                方波形成环节
            </h3>
            <p class="text-gray-600 leading-relaxed">输入信号从A、B端输入，限流后由双向稳压管限幅。它将起伏的正弦波“削平”，修整为幅度恒定的方波信号。</p>
        </div>
        <div class="bg-white rounded-xl shadow p-6 border-t-4 border-emerald-400">
            <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <span class="bg-emerald-100 text-emerald-700 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">2</span>
                微分环节
            </h3>
            <p class="text-gray-600 leading-relaxed">方波进入电容微分网络。方波的每一个电压突变都会通过电容转换为极窄的正负尖脉冲信号，脉冲个数直接体现频率的高低。</p>
        </div>
        <div class="bg-white rounded-xl shadow p-6 border-t-4 border-amber-400">
            <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <span class="bg-amber-100 text-amber-700 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">3</span>
                整流环节
            </h3>
            <p class="text-gray-600 leading-relaxed">利用二极管进行整流。负向尖脉冲被滤除，确保后续流入微安表的只有单向的脉冲电流。</p>
        </div>
        <div class="bg-white rounded-xl shadow p-6 border-t-4 border-rose-400">
            <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <span class="bg-rose-100 text-rose-700 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">4</span>
                指示环节
            </h3>
            <p class="text-gray-600 leading-relaxed">单向脉冲电流流入表头，电容进行平滑滤波。单位时间内积攒的电荷量（即平均直流电平）便与输入频率成正比。</p>
        </div>
    </div>

    <div style="text-align:center; margin-top:30px; margin-bottom:30px;">
        <button id="finishBtn" class="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition transform hover:-translate-y-1">我已掌握该原理并完成实训</button>
    </div>
</div>

<script>
    document.addEventListener('DOMContentLoaded', () => {
        const slider = document.getElementById('freq-slider');
        const freqDisplay = document.getElementById('freq-value');
        const pointer = document.getElementById('meter-pointer');
        
        const pathInput = document.getElementById('wave-input');
        const pathSquare = document.getElementById('wave-square');
        const pathDiff = document.getElementById('wave-diff');
        const pathRect = document.getElementById('wave-rect');
        const pathMeter = document.getElementById('wave-meter');
        const pathBias = document.getElementById('wave-bias');

        function updateAll(freq) {
            freqDisplay.textContent = freq;
            const angle = -40 + (freq / 100) * 80;
            pointer.setAttribute('transform', 'rotate(' + angle + ')');

            const W = 50;       
            const midY = 15;    
            const amp = 10;     

            if (freq === 0) {
                const flatLine = 'M 0 ' + midY + ' L ' + W + ' ' + (midY + 0.01);
                pathInput.setAttribute('d', flatLine);
                pathSquare.setAttribute('d', flatLine);
                pathDiff.setAttribute('d', flatLine);
                pathRect.setAttribute('d', flatLine);
                pathMeter.setAttribute('d', 'M 0 28 L ' + W + ' 28.01');
                pathBias.setAttribute('d', 'M 0 22 L ' + W + ' 22.01');
                return;
            }

            const cycles = Math.max(0.5, (freq / 100) * 4);
            const period = W / cycles;
            
            let dInput = 'M 0 ' + midY;
            let dSquare = 'M 0 ' + (midY - amp);
            let dDiff = 'M 0 ' + midY;
            let dRect = 'M 0 ' + midY;

            for(let x = 0; x <= W; x += 1) {
                dInput += ' L ' + x + ' ' + (midY - amp * Math.sin((x / period) * Math.PI * 2));
            }

            for(let i = 0; i <= Math.ceil(cycles); i++) {
                let startX = i * period;
                let halfX = startX + period / 2;
                let endX = startX + period;
                
                if (startX > W) break;

                let sqStart = Math.min(startX, W);
                let sqHalf = Math.min(halfX, W);
                let sqEnd = Math.min(endX, W);
                dSquare += ' L ' + sqStart + ' ' + (midY - amp) + ' L ' + sqHalf + ' ' + (midY - amp) + ' L ' + sqHalf + ' ' + (midY + amp) + ' L ' + sqEnd + ' ' + (midY + amp);

                const spikeW = Math.min(2.5, period / 6); 
                if (startX < W) {
                    dDiff += ' L ' + startX + ' ' + midY + ' L ' + (startX + 0.5) + ' ' + (midY - amp * 1.3) + ' L ' + Math.min(startX + spikeW, W) + ' ' + midY;
                }
                if (halfX < W) {
                    dDiff += ' L ' + halfX + ' ' + midY + ' L ' + (halfX + 0.5) + ' ' + (midY + amp * 1.3) + ' L ' + Math.min(halfX + spikeW, W) + ' ' + midY;
                }
                dDiff += ' L ' + Math.min(endX, W) + ' ' + midY;

                if (startX < W) {
                    dRect += ' L ' + startX + ' ' + midY + ' L ' + (startX + 0.5) + ' ' + (midY - amp * 1.3) + ' L ' + Math.min(startX + spikeW, W) + ' ' + midY;
                }
                dRect += ' L ' + Math.min(endX, W) + ' ' + midY;
            }

            pathInput.setAttribute('d', dInput);
            pathSquare.setAttribute('d', dSquare);
            pathDiff.setAttribute('d', dDiff);
            pathRect.setAttribute('d', dRect);

            const meterY = 28 - (freq / 100) * 24; 
            pathMeter.setAttribute('d', 'M 0 ' + meterY + ' L ' + W + ' ' + (meterY + 0.01));
            pathBias.setAttribute('d', 'M 0 22 L ' + W + ' 22.01');
        }

        slider.addEventListener('input', (e) => {
            updateAll(parseInt(e.target.value, 10));
        });
        
        updateAll(parseInt(slider.value, 10));

        document.getElementById('finishBtn').addEventListener('click', function() {
            this.innerText = '实训已记录 ✔';
            this.classList.replace('bg-blue-600', 'bg-green-600');
            this.classList.replace('hover:bg-blue-700', 'hover:bg-green-700');
            if(window.parent) {
                window.parent.postMessage({ type: 'MODULE_COMPLETED', module: 'MODULE_NAME' }, '*');
            }
        });
    });
</script>
</body>
</html>`;

// --- UI 组件: Navbar ---
const Navbar = ({ navigateTo }) => (
  <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-16 items-center">
        <div className="flex items-center cursor-pointer" onClick={() => navigateTo('home')}>
          <div className="bg-slate-900 p-2 rounded-lg mr-3">
            <BrainCircuit className="h-6 w-6 text-teal-400" />
          </div>
          <span className="font-bold text-xl text-slate-900 tracking-tight">Cognis <span className="text-teal-600 font-light">AI Agent</span></span>
        </div>
        <div className="flex items-center space-x-4">
          <button className="text-slate-400 hover:text-slate-600 transition-colors"><Search className="h-5 w-5" /></button>
          <button className="text-slate-400 hover:text-slate-600 transition-colors"><Bell className="h-5 w-5" /></button>
          <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
            <User className="h-4 w-4 text-slate-600" />
          </div>
        </div>
      </div>
    </div>
  </nav>
);

// --- UI 组件: 雷达图 ---
const RadarChart = ({ data, dimensions, size = 300 }) => {
  const center = size / 2;
  const radius = (size / 2) * 0.7; 
  const angleStep = (Math.PI * 2) / dimensions.length;

  const getPointCoordinates = (value, index, max) => {
    const r = (value / max) * radius;
    const theta = index * angleStep - Math.PI / 2; 
    return {
      x: center + r * Math.cos(theta),
      y: center + r * Math.sin(theta)
    };
  };

  const gridLevels = 5;
  const grids = Array.from({ length: gridLevels }).map((_, levelIndex) => {
    const levelRadius = radius * ((levelIndex + 1) / gridLevels);
    const points = dimensions.map((_, i) => {
      const theta = i * angleStep - Math.PI / 2;
      return `${center + levelRadius * Math.cos(theta)},${center + levelRadius * Math.sin(theta)}`;
    }).join(' ');
    return <polygon key={levelIndex} points={points} fill="none" stroke="#e2e8f0" strokeWidth="1" />;
  });

  const axes = dimensions.map((_, i) => {
    const theta = i * angleStep - Math.PI / 2;
    return (
      <line key={i} x1={center} y1={center} x2={center + radius * Math.cos(theta)} y2={center + radius * Math.sin(theta)} stroke="#e2e8f0" strokeWidth="1" />
    );
  });

  const dataPoints = data.map((val, i) => getPointCoordinates(val, i, dimensions[i].max));
  const dataPointsString = dataPoints.map(p => `${p.x},${p.y}`).join(' ');

  const labels = dimensions.map((dim, i) => {
    const theta = i * angleStep - Math.PI / 2;
    const labelRadius = radius + 25;
    const x = center + labelRadius * Math.cos(theta);
    const y = center + labelRadius * Math.sin(theta);
    let textAnchor = "middle";
    if (Math.abs(Math.cos(theta)) > 0.1) textAnchor = Math.cos(theta) > 0 ? "start" : "end";
    return (
      <text key={i} x={x} y={y + 4} textAnchor={textAnchor} fontSize="12" fill="#475569" className="font-medium">{dim.name}</text>
    );
  });

  return (
    <svg width={size} height={size} className="mx-auto drop-shadow-sm">
      {grids}
      {axes}
      <polygon points={dataPointsString} fill="rgba(13, 148, 136, 0.2)" stroke="#0d9488" strokeWidth="2" className="transition-all duration-500" />
      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="4" fill="#0d9488" stroke="#ffffff" strokeWidth="1.5" />
      ))}
      {labels}
    </svg>
  );
};

// --- UI 组件: 首页 ---
const HomeView = ({ isAnimating, navigateTo }) => (
  <div className={`transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
    <section className="bg-slate-900 text-white py-20 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 rounded-full bg-teal-500 blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-80 h-80 rounded-full bg-blue-600 blur-3xl"></div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">Cognis AI Agent</h1>
        <p className="text-xl md:text-2xl font-light text-slate-300 mb-12 tracking-wide">
          Sensing the world, engineering the future.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div onClick={() => navigateTo('备课')} className="group bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-8 rounded-2xl hover:bg-slate-800 transition-all cursor-pointer hover:shadow-2xl hover:shadow-teal-900/20 text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><BookOpen className="w-24 h-24" /></div>
            <div className="bg-blue-500/20 text-blue-400 p-3 rounded-xl inline-block mb-6"><BookOpen className="w-8 h-8" /></div>
            <h3 className="text-2xl font-bold mb-2">备课模式</h3>
            <p className="text-slate-400 mb-8 h-12">智能生成教案，分析学情数据，为您打造个性化教学方案。</p>
            <div className="flex items-center text-blue-400 font-medium group-hover:translate-x-2 transition-transform">进入备课 <ArrowRight className="ml-2 w-4 h-4" /></div>
          </div>
          <div onClick={() => navigateTo('上课')} className="group bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-8 rounded-2xl hover:bg-slate-800 transition-all cursor-pointer hover:shadow-2xl hover:shadow-teal-900/20 text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><MonitorPlay className="w-24 h-24" /></div>
            <div className="bg-teal-500/20 text-teal-400 p-3 rounded-xl inline-block mb-6"><MonitorPlay className="w-8 h-8" /></div>
            <h3 className="text-2xl font-bold mb-2">上课模式</h3>
            <p className="text-slate-400 mb-8 h-12">实时学情监测，AI助教互动答疑，让课堂充满活力。</p>
            <div className="flex items-center text-teal-400 font-medium group-hover:translate-x-2 transition-transform">进入上课 <ArrowRight className="ml-2 w-4 h-4" /></div>
          </div>
          <div onClick={() => navigateTo('课后')} className="group bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-8 rounded-2xl hover:bg-slate-800 transition-all cursor-pointer hover:shadow-2xl hover:shadow-teal-900/20 text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><ClipboardCheck className="w-24 h-24" /></div>
            <div className="bg-indigo-500/20 text-indigo-400 p-3 rounded-xl inline-block mb-6"><ClipboardCheck className="w-8 h-8" /></div>
            <h3 className="text-2xl font-bold mb-2">课后模式</h3>
            <p className="text-slate-400 mb-8 h-12">自动批改作业，生成多维评价报告，精准定位知识薄弱点。</p>
            <div className="flex items-center text-indigo-400 font-medium group-hover:translate-x-2 transition-transform">进入课后 <ArrowRight className="ml-2 w-4 h-4" /></div>
          </div>
        </div>
      </div>
    </section>

    <section className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center mb-10">
          <BarChart3 className="w-6 h-6 text-slate-700 mr-3" />
          <h2 className="text-2xl font-bold text-slate-800">学情数据总览</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center">
            <h3 className="text-lg font-semibold text-slate-800 mb-6 w-full text-left">学生总体评价五维雷达图</h3>
            <div className="flex-grow flex items-center justify-center w-full">
              <RadarChart data={studentRadarData} dimensions={radarDimensions} size={320} />
            </div>
            <div className="mt-6 text-sm text-slate-500 text-center">
              总体评价优秀，在<span className="font-semibold text-teal-600">学习态度</span>和<span className="font-semibold text-teal-600">创新能力</span>方面表现突出。
            </div>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 lg:col-span-2">
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-lg font-semibold text-slate-800">知识模块掌握进度</h3>
                <span className="text-sm px-3 py-1 bg-slate-100 text-slate-600 rounded-full font-medium">课程：电工电子技术</span>
            </div>
            <div className="space-y-6">
              {knowledgeModules.map((module, index) => (
                <div key={index} className="group">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-medium text-slate-700 group-hover:text-teal-600 transition-colors">{module.name}</span>
                    <span className="text-sm font-bold text-slate-600">{module.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div className={`h-full rounded-full ${module.color} transition-all duration-1000 ease-out`} style={{ width: `${module.progress}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
);

// --- 工作流组件: 案例生成 ---
const CaseGenerationView = ({ activeCourse, setCaseGenerationState }) => {
  const [step, setStep] = useState(1);
  const [selectedKnowledge, setSelectedKnowledge] = useState([]);
  const [description, setDescription] = useState('');
  const [caseType, setCaseType] = useState('project'); 
  const [complexity, setComplexity] = useState(2); 
  const [selectedMethods, setSelectedMethods] = useState([]);
  const [uploadedFile, setUploadedFile] = useState(null);

  const knowledgePoints = activeCourse === '第四章第1-5节 频率与相位的测量'
      ? ['工频测量', '高低频测量', '电动系频率表', '变换式频率表']
      : ['误差的分类', '绝对误差', '相对误差', '引用误差'];

  const methodsOptions = [
    { id: '启', label: '启 —— 通过对话引发学生思考，而不直接给答案', icon: Lightbulb },
    { id: '降', label: '降 —— 把复杂问题转化为小问题，分层递进', icon: ArrowDownToLine }
  ];

  const toggleKnowledge = (kp) => setSelectedKnowledge(prev => prev.includes(kp) ? prev.filter(k => k !== kp) : [...prev, kp]);
  const toggleMethod = (methodId) => setSelectedMethods(prev => prev.includes(methodId) ? prev.filter(m => m !== methodId) : [...prev, methodId]);

  const handleFileUpload = (e) => {
    e.preventDefault();
    if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) setUploadedFile(e.dataTransfer.files[0]);
    else if (e.target.files && e.target.files.length > 0) setUploadedFile(e.target.files[0]);
  };

  const handleGenerate = () => {
    setStep(2);
    setTimeout(() => {
      setStep(3);
      if (setCaseGenerationState) {
        setCaseGenerationState(activeCourse, prev => ({ ...prev, [caseType]: true }));
      }
    }, 2500);
  };

  const getIframeContent = () => {
      if (activeCourse === '第一章第4-6节 误差的表示和消除') {
          return caseType === 'project' ? ghostTrippingHTML : voltmeterSimHTML;
      } else if (activeCourse === '第四章第1-5节 频率与相位的测量') {
          return caseType === 'project' 
            ? getPlaceholderHTML('大型变电站频率异常排查') 
            : frequencyMeterHTMLTemplate.replace(/PAGE_TITLE/g, '微分型变换式频率测量仪演示').replace(/MODULE_NAME/g, '微分型频率表原理演示');
      }
      return '';
  };

  return (
    <div className="w-full max-w-5xl mx-auto h-full overflow-y-auto pb-12 pr-2 custom-scrollbar">
      {step === 1 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in duration-500">
          <div className="p-6 border-b border-slate-100 bg-slate-50">
            <h3 className="text-xl font-bold text-slate-800 flex items-center">
              <Settings2 className="w-6 h-6 mr-2 text-indigo-500" /> 定制化教学案例生成配置
            </h3>
            <p className="text-sm text-slate-500 mt-1">设置参数，让 AI 引擎为您产出最匹配学情的专业实战案例。</p>
          </div>
          
          <div className="p-8 space-y-8">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">1. 勾选 AI 解析出的相关知识点 (可多选)</label>
              <div className="flex flex-wrap gap-3">
                {knowledgePoints.map((kp, idx) => (
                  <div key={idx} onClick={() => toggleKnowledge(kp)} className={`px-4 py-2 rounded-lg border text-sm font-medium cursor-pointer transition-all flex items-center ${selectedKnowledge.includes(kp) ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300'}`}>
                    {selectedKnowledge.includes(kp) ? <CheckCircle2 className="w-4 h-4 mr-1.5" /> : <div className="w-4 h-4 rounded-full border border-slate-300 mr-1.5"></div>}
                    {kp}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">2. 案例情境与背景描述 (选填)</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="例如：请以大型交直流微电网的并网监控为背景..." className="w-full h-24 p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-700 resize-none transition-all"></textarea>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">3. 选择案例呈现载体类型</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div onClick={() => setCaseType('project')} className={`p-5 rounded-xl border-2 cursor-pointer transition-all flex flex-col ${caseType === 'project' ? 'border-indigo-500 bg-indigo-50/30' : 'border-slate-200 hover:border-indigo-200 bg-white'}`}>
                  <div className="flex items-center mb-2">
                    <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${caseType === 'project' ? 'border-indigo-500' : 'border-slate-400'}`}>
                       {caseType === 'project' && <div className="w-2.5 h-2.5 rounded-full bg-indigo-500"></div>}
                    </div>
                    <span className="font-bold text-slate-800 text-lg">生成项目案例</span>
                  </div>
                  <p className="text-sm text-slate-500 pl-8">将真实工业现场的项目或事故日志转化为交互式沙盘。</p>
                </div>

                <div onClick={() => setCaseType('circuit')} className={`p-5 rounded-xl border-2 cursor-pointer transition-all flex flex-col ${caseType === 'circuit' ? 'border-indigo-500 bg-indigo-50/30' : 'border-slate-200 hover:border-indigo-200 bg-white'}`}>
                  <div className="flex items-center mb-2">
                    <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${caseType === 'circuit' ? 'border-indigo-500' : 'border-slate-400'}`}>
                       {caseType === 'circuit' && <div className="w-2.5 h-2.5 rounded-full bg-indigo-500"></div>}
                    </div>
                    <span className="font-bold text-slate-800 text-lg">设计电路模型</span>
                  </div>
                  <p className="text-sm text-slate-500 pl-8">由 AI 设计并生成一套可模拟真实测量的动态电路拓扑图。</p>
                </div>
              </div>

              <div className="pl-2">
                {caseType === 'project' ? (
                  <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                    <label className={`block border-2 border-dashed rounded-xl p-6 text-center transition-colors ${uploadedFile ? 'border-indigo-300 bg-indigo-50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100 cursor-pointer'}`} onDragOver={(e) => e.preventDefault()} onDrop={handleFileUpload}>
                      <input type="file" className="hidden" onChange={handleFileUpload} />
                      {uploadedFile ? (
                        <div className="flex flex-col items-center">
                          <FileText className="w-10 h-10 text-indigo-500 mb-2" />
                          <span className="text-indigo-800 font-semibold">{uploadedFile.name}</span>
                          <span className="text-xs text-indigo-500 mt-1">已就绪 (点击重新选择)</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <UploadCloud className="w-10 h-10 text-slate-400 mb-2" />
                          <span className="text-slate-600 font-medium">拖拽真实工程文档到此处，或点击上传</span>
                          <span className="text-xs text-slate-400 mt-1">支持 PDF, DOCX, TXT 等参考材料</span>
                        </div>
                      )}
                    </label>
                  </div>
                ) : (
                  <div className="animate-in fade-in slide-in-from-top-2 duration-300 bg-slate-50 p-5 rounded-xl border border-slate-200">
                    <p className="text-sm font-bold text-slate-700 mb-3 flex items-center"><Layers className="w-4 h-4 mr-2" /> 调节电路模型复杂程度</p>
                    <div className="flex bg-slate-200/60 rounded-lg p-1 relative">
                      <div className="absolute top-1 bottom-1 w-1/3 transition-all duration-300 ease-out" style={{ transform: `translateX(${(complexity - 1) * 100}%)`, padding: '0 4px' }}>
                        <div className="w-full h-full bg-white rounded-md shadow-sm"></div>
                      </div>
                      {[1, 2, 3].map(level => (
                        <button key={level} onClick={() => setComplexity(level)} className={`flex-1 py-2 text-sm font-bold relative z-10 transition-colors ${complexity === level ? 'text-indigo-700' : 'text-slate-500 hover:text-slate-700'}`}>
                          {level === 1 ? '初级 (单节点)' : level === 2 ? '中级 (常规干扰)' : '高级 (复杂网络)'}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">4. 附加教学法策略</label>
              <div className="space-y-3">
                {methodsOptions.map(method => {
                  const MIcon = method.icon;
                  const isSelected = selectedMethods.includes(method.id);
                  return (
                    <div key={method.id} onClick={() => toggleMethod(method.id)} className={`flex items-center p-4 rounded-xl border cursor-pointer transition-colors ${isSelected ? 'bg-amber-50 border-amber-300' : 'bg-white border-slate-200 hover:border-slate-300'}`}>
                      <div className={`w-5 h-5 rounded flex items-center justify-center mr-4 flex-shrink-0 ${isSelected ? 'bg-amber-500' : 'border-2 border-slate-300'}`}>
                         {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                      </div>
                      <MIcon className={`w-5 h-5 mr-3 flex-shrink-0 ${isSelected ? 'text-amber-600' : 'text-slate-400'}`} />
                      <span className={`text-sm font-medium ${isSelected ? 'text-amber-800' : 'text-slate-600'}`}>{method.label}</span>
                    </div>
                  )
                })}
              </div>
            </div>
            
            <button onClick={handleGenerate} className="w-full py-4 rounded-xl font-bold flex items-center justify-center transition-all bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white shadow-lg transform hover:-translate-y-0.5 text-lg mt-4">
              <Sparkles className="w-6 h-6 mr-2" /> 开始生成专业教学案例
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-16 flex flex-col items-center justify-center min-h-[500px] animate-in fade-in duration-300">
           <div className="relative mb-8">
             <div className="absolute inset-0 bg-indigo-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
             <BrainCircuit className="w-24 h-24 text-indigo-500 relative z-10 animate-bounce" />
           </div>
           <h3 className="text-2xl font-bold text-slate-800 mb-4">AI 正在为您深度构建可交互的教学沙盘...</h3>
           <p className="text-slate-500 text-center max-w-lg leading-relaxed">
             正在融合 <strong className="text-indigo-600">{caseType === 'project' ? '实际工程背景' : '电路参数模型'}</strong>，
             {selectedMethods.length > 0 && <span>并应用<strong className="text-amber-600">启发式与降维拆解</strong>教学法，</span>}
             预计需要几秒钟时间，请稍候。
           </p>
        </div>
      )}

      {step === 3 && (
        <div className="w-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-8 duration-500 flex flex-col mt-4">
          <div className="p-8 border-b border-slate-100 bg-indigo-50/50 flex justify-between items-center shrink-0">
            <div>
              <h3 className="text-2xl font-bold text-indigo-900 flex items-center mb-2">
                <Sparkles className="w-6 h-6 mr-2 text-indigo-500" /> AI 定制交互式教学案例产出
              </h3>
              <p className="text-indigo-700/70 text-sm">已将您的需求转化为可直接在上课模式中使用的沉浸式实训沙盘</p>
            </div>
            <button onClick={() => setStep(1)} className="text-indigo-600 bg-white border border-indigo-200 hover:bg-indigo-50 px-5 py-2.5 rounded-lg text-sm font-bold shadow-sm transition-colors flex items-center">
              <RefreshCw className="w-4 h-4 mr-2" /> 重新配置案例
            </button>
          </div>
          <div className="w-full h-[800px] bg-slate-50 relative">
            <iframe srcDoc={getIframeContent()} className="w-full h-full border-none absolute inset-0" title="Generated Interactive Case" sandbox="allow-scripts allow-same-origin" />
          </div>
        </div>
      )}
    </div>
  );
};

// --- 工作流组件: 思政导入 ---
const IdeologicalImportView = ({ activeCourse, ideologicalState, setIdeologicalState }) => {
  const { step, topic, knowledge, selectedRelations } = ideologicalState || { step: 1, topic: '', knowledge: '测量误差', selectedRelations: [], isCompletedOnce: false };
  const [topicSetIndex, setTopicSetIndex] = useState(0);

  const hotTopicSets = [
    ["春晚机器人", "伊朗战争", "脑机接口落地", "美国中产斩杀线"],
    ["Sora大模型生成", "新能源汽车出海", "长征火箭发射", "量子计算突破"],
    ["室温超导争议", "芯片法案破局", "深海探测发现", "火星探测计划"]
  ];

  const isCourseA = activeCourse === '第一章第4-6节 误差的表示和消除';

  const optionsA = [
    { title: '底线思维与忧患意识', desc: '在经济或社会系统中，忽视微小的波动往往会导致越过“中产斩杀线”（系统崩溃）。这映射到工程领域，即测量误差如果不受控，一旦突破工程设计的底线，将会带来灾难性后果。' },
    { title: '实事求是', desc: '面对真实的经济数据或严谨的测量数据，必须承认绝对误差的客观存在。不可自欺欺人地掩盖偏差，而应科学评估真实状况，寻找消除和修正误差的真理。' },
    { title: '全局观与系统思维', desc: '局部的相对误差如果不加控制，会在整个复杂的系统网络（正如宏观经济或国家电网）中不断累积放大，最终引发蝴蝶效应。' },
    { title: '精益求精的工匠精神', desc: '在残酷的竞争中突破危机需要核心竞争力。在工程上，不断升级量程和仪表精度，追求极限地消除系统误差，正是大国工匠追求卓越的生动体现。' }
  ];

  const optionsB = [
    { title: '战略定力与主频稳定', desc: '在电网中，50Hz工频是整个工业系统的生命线，任何频率的失准都会引发大面积设备停摆。这映射到国家发展和个人成长中，即面对复杂的外部干扰，必须保持“主频”稳定，坚守战略定力，不随波逐流。' },
    { title: '同频共振与协作精神', desc: '交流电网的并网运行不仅要求频率相同，更要求相位一致。引申到团队建设与社会发展中，只有思想同心、目标同向，才能形成强大的“同频共振”合力，实现 1+1>2 的系统效能。' },
    { title: '明辨是非与滤除杂波', desc: '在测量高频或低频微弱信号时，极易受到环境噪声和谐波的干扰，必须通过滤波电路提取出真实的特征波形。如同在纷繁复杂的网络信息时代，当代青年必须具备一双慧眼，滤除杂波，坚定探寻事实真相。' },
    { title: '精益求精的工匠精神', desc: '在航空航天等尖端领域，对相差的测定精度要求甚至达到了微秒级。这种极致的精度追求，正是推动我国核心科技自立自强的大国工匠精神的完美诠释。' }
  ];

  const currentOptions = isCourseA ? optionsA : optionsB;

  const handleNextTopicSet = () => setTopicSetIndex((prev) => (prev + 1) % hotTopicSets.length);

  const setStep = (newStep) => setIdeologicalState(prev => ({ ...prev, step: newStep }));
  const setTopic = (newTopic) => setIdeologicalState(prev => ({ ...prev, topic: newTopic }));
  const setKnowledge = (newKnowledge) => setIdeologicalState(prev => ({ ...prev, knowledge: newKnowledge }));

  const startAnalysis = () => {
    if (!topic.trim()) return;
    setStep(2);
    setTimeout(() => setStep(3), 3000);
  };

  const generateGuide = () => {
    if (selectedRelations.length === 0) return;
    setStep(4);
    setTimeout(() => {
      setIdeologicalState(prev => ({ ...prev, step: 5, isCompletedOnce: true }));
    }, 3500);
  };

  const toggleRelation = (rel) => {
    setIdeologicalState(prev => {
      const current = prev.selectedRelations || [];
      const newRels = current.includes(rel) ? current.filter(r => r !== rel) : [...current, rel];
      return { ...prev, selectedRelations: newRels };
    });
  };

  return (
    <div className="w-full max-w-5xl mx-auto h-full overflow-y-auto pb-12 pr-2 custom-scrollbar flex flex-col items-center">
      <div className="w-full max-w-3xl mb-8 flex justify-between items-center text-sm font-medium text-slate-400 relative">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -z-10 -translate-y-1/2"></div>
        <div className="absolute top-1/2 left-0 h-0.5 bg-blue-500 -z-10 -translate-y-1/2 transition-all duration-500" style={{ width: step >= 5 ? '100%' : step >= 3 ? '50%' : '0%' }}></div>
        
        <div className={`flex flex-col items-center bg-white px-2 ${step >= 1 ? 'text-blue-600' : ''}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 border-2 ${step >= 1 ? 'border-blue-500 bg-blue-50' : 'border-slate-300 bg-white'}`}>1</div>
          <span>确立锚点</span>
        </div>
        <div className={`flex flex-col items-center bg-white px-2 ${step >= 3 ? 'text-blue-600' : ''}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 border-2 ${step >= 3 ? 'border-blue-500 bg-blue-50' : 'border-slate-300 bg-white'}`}>2</div>
          <span>挖掘映射</span>
        </div>
        <div className={`flex flex-col items-center bg-white px-2 ${step >= 5 ? 'text-blue-600' : ''}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 border-2 ${step >= 5 ? 'border-blue-500 bg-blue-50' : 'border-slate-300 bg-white'}`}>3</div>
          <span>生成教案</span>
        </div>
      </div>

      {step === 1 && (
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in zoom-in-95 duration-300">
          <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
            <Target className="w-6 h-6 mr-2 text-blue-500" /> 选择导入视角
          </h3>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-semibold text-slate-700">1. 请输入或选择拟导入的时事热点话题：</label>
                <button onClick={handleNextTopicSet} className="text-blue-500 hover:text-blue-700 text-xs font-medium flex items-center bg-blue-50 px-2 py-1 rounded transition-colors">
                  <RefreshCw className="w-3 h-3 mr-1" /> 换一批热点
                </button>
              </div>
              <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="例如：美国中产斩杀线..." className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-800"/>
              <div className="flex flex-wrap gap-2 mt-3">
                {hotTopicSets[topicSetIndex].map((hotTopic, i) => (
                  <span key={i} onClick={() => setTopic(hotTopic)} className={`text-sm px-3 py-1.5 rounded-lg border cursor-pointer transition-colors ${topic === hotTopic ? 'bg-blue-500 text-white border-blue-500' : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600'}`}>{hotTopic}</span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">2. AI 提取的本节课核心知识点：</label>
              <div className="relative">
                <BrainCircuit className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input type="text" value={knowledge} onChange={(e) => setKnowledge(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 font-medium" />
              </div>
            </div>
            
            <button onClick={startAnalysis} disabled={!topic.trim()} className={`w-full py-4 rounded-xl font-bold flex items-center justify-center transition-all ${topic.trim() ? 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg transform hover:-translate-y-0.5' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}>
              <Sparkles className="w-5 h-5 mr-2" /> 一键分析思政映射关联
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-sm border border-slate-200 p-12 flex flex-col items-center justify-center min-h-[400px] animate-in fade-in duration-300">
           <div className="relative mb-6">
             <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
             <BrainCircuit className="w-20 h-20 text-blue-500 relative z-10 animate-bounce" />
           </div>
           <h3 className="text-2xl font-bold text-slate-800 mb-3">正在深度联想与跨界映射...</h3>
           <p className="text-slate-500 text-center">AI 正在寻找 <strong>“{topic}”</strong> 与 <strong>“{knowledge}”</strong> 之间的底层哲学逻辑与工程思政联系。</p>
        </div>
      )}

      {step === 3 && (
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in slide-in-from-bottom-8 duration-500">
          <div className="mb-6 pb-6 border-b border-slate-100">
            <h3 className="text-xl font-bold text-slate-800 mb-2 flex items-center"><CheckSquare className="w-6 h-6 mr-2 text-blue-500" /> AI 匹配结果</h3>
            <p className="text-slate-500 text-sm">已为您找到 {currentOptions.length} 个高度契合的思政映射维度，请勾选您希望在课堂上展开讲述的要点（建议选 2 项）：</p>
          </div>

          <div className="space-y-4 mb-8">
            {currentOptions.map((opt, idx) => {
              const isSelected = selectedRelations.includes(opt.title);
              return (
                <div key={idx} onClick={() => toggleRelation(opt.title)} className={`p-5 rounded-xl border-2 cursor-pointer transition-all flex items-start ${isSelected ? 'border-blue-500 bg-blue-50/50' : 'border-slate-100 hover:border-blue-200 bg-white'}`}>
                  <div className={`w-6 h-6 rounded mr-4 mt-0.5 flex items-center justify-center flex-shrink-0 ${isSelected ? 'bg-blue-500' : 'border-2 border-slate-300'}`}>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-white" />}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-800 mb-1">{opt.title}</h4>
                    <p className="text-sm text-slate-600 leading-relaxed">{opt.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <button onClick={generateGuide} disabled={selectedRelations.length === 0} className={`w-full py-4 rounded-xl font-bold flex items-center justify-center transition-all ${selectedRelations.length > 0 ? 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg transform hover:-translate-y-0.5' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}>
            <Presentation className="w-5 h-5 mr-2" /> AI 展开教学引导设计
          </button>
        </div>
      )}

      {step === 4 && (
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-sm border border-slate-200 p-12 flex flex-col items-center justify-center min-h-[400px] animate-in fade-in duration-300">
           <div className="relative mb-6">
             <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
             <Loader2 className="w-20 h-20 text-blue-500 relative z-10 animate-spin" />
           </div>
           <h3 className="text-2xl font-bold text-slate-800 mb-3">正在编排课堂话术与互动问题...</h3>
           <p className="text-slate-500 text-center">基于您选择的 <span className="font-bold text-blue-600">{selectedRelations.length}</span> 个思政点，正在生成层层递进的课堂引导方案。</p>
        </div>
      )}

      {step === 5 && (
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-8 duration-500">
          <div className="p-8 border-b border-slate-100 bg-blue-50/50 flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-bold text-blue-900 flex items-center mb-2"><Sparkles className="w-6 h-6 mr-2 text-yellow-500" /> 课堂思政导入执行讲义</h3>
              <p className="text-blue-700/70 text-sm">话题锚点：{topic} ➔ 映射知识点：{knowledge}</p>
            </div>
            <button onClick={() => setStep(1)} className="text-blue-600 bg-white border border-blue-200 hover:bg-blue-50 px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors flex items-center">
              <span className="mr-1 text-lg leading-none">+</span> 增加新的思政映射关联
            </button>
          </div>
          
          <div className="p-8 space-y-8">
            <div className="relative pl-8 border-l-4 border-amber-400">
              <div className="absolute -left-3.5 top-0 w-6 h-6 rounded-full bg-amber-400 text-white flex items-center justify-center font-bold text-sm">1</div>
              <h4 className="text-lg font-bold text-slate-800 mb-3">第一步：引导学生关注“{selectedRelations[0] || currentOptions[0].title}”</h4>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-3">
                <span className="text-amber-600 font-bold text-sm mb-2 block">【教师话术参考】</span>
                <p className="text-slate-700 leading-relaxed text-sm">
                  {isCourseA 
                    ? `“同学们，近期新闻里热议的‘${topic}’现象，本质上是家庭经济系统缺乏足够的冗余和抗风险能力。面对极其微小的波动，系统就轻易跌破了生存的底线。不仅是宏观经济，在我们的工程设计中，同样存在着决定成败的‘底线’。大家有没有想过，工程系统的底线往往是由什么击穿的？”`
                    : `“同学们，刚才我们提到了‘${topic}’这个热点。在一个复杂动荡的系统中，无论是宏观层面的大国博弈，还是微观层面的个人职业规划，都需要坚守战略定力。这就像在我们国家的电力系统中，50Hz的工频就是一条绝对不能动摇的生命线。任何外部环境的冲击如果导致了这个主频的偏离，整个工业机器就会瘫痪。”`
                  }
                </p>
              </div>
              <div className="flex items-start">
                <FileQuestion className="w-5 h-5 text-slate-400 mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-slate-600 font-medium">
                  {isCourseA 
                    ? "互动提问：如果一架航天器的导航传感器每天只发生 0.1% 的偏航，一年后它还会留在预定轨道上吗？"
                    : "互动提问：如果在雷暴等极端天气下，电网的频率瞬间跌到了 48Hz，大家觉得精密加工机床的伺服系统会做出什么反应？"}
                </p>
              </div>
            </div>

            {selectedRelations.length > 1 && (
              <div className="relative pl-8 border-l-4 border-blue-500">
                <div className="absolute -left-3.5 top-0 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-sm">2</div>
                <h4 className="text-lg font-bold text-slate-800 mb-3">第二步：引导学生关注“{selectedRelations[1] || currentOptions[1].title}”</h4>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-3">
                  <span className="text-blue-600 font-bold text-sm mb-2 block">【教师话术参考】</span>
                  <p className="text-slate-700 leading-relaxed text-sm">
                    {isCourseA
                      ? "“掩盖危机并不能阻止破产，同样，无论是面对宏观经济数据的虚假繁荣，还是我们控制台仪表盘上的指针，我们都必须坚持‘实事求是’的核心精神。在物理世界中，没有任何仪器是绝对完美的。承认测量结果与真实值之间客观存在的差异，不盲信、不造假，是工程师最基础的职业道德。”"
                      : "“除了频率本身的稳定性，面对浩大的跨区域系统协作，比如国家之间的科技合作，或者我们一个课题小组的攻坚克难，我们常常讲要‘同频共振’。在工程物理层面，这就意味着两个并网运行的交流系统，不仅频率必须分毫不差，连‘相位’也必须绝对一致，否则就会产生破坏性的环流相互抵消。”"
                    }
                  </p>
                </div>
                <div className="flex items-start">
                  <FileQuestion className="w-5 h-5 text-slate-400 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-slate-600 font-medium">
                    {isCourseA
                      ? "互动提问：当我们在现场发现测量数据与理论设计图纸不符时，第一反应应该是强行修改数据迎合验收，还是承认现实并溯源分析它？"
                      : "互动提问：假设团队里有两个齿轮，转速一样快（同频），但它们咬合的时间总是错开半秒钟（存在相位差），这台机器还能转起来吗？"
                    }
                  </p>
                </div>
              </div>
            )}

            <div className="relative pl-8 border-l-4 border-teal-500">
              <div className="absolute -left-3.5 top-0 w-6 h-6 rounded-full bg-teal-500 text-white flex items-center justify-center font-bold text-sm">{selectedRelations.length > 1 ? '3' : '2'}</div>
              <h4 className="text-lg font-bold text-slate-800 mb-3">第{selectedRelations.length > 1 ? '三' : '二'}步：引出“{knowledge}”的专业理论</h4>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-3">
                <span className="text-teal-600 font-bold text-sm mb-2 block">【教师话术参考】</span>
                <p className="text-slate-700 leading-relaxed text-sm">
                  {isCourseA
                    ? "“综上所述，为了守住工程安全的生命底线、践行实事求是的求真精神，我们必须用科学的眼光来认识这种‘不完美’。在测量学中，我们将这种客观存在的偏差称之为‘误差’。今天这节课，我们就来系统地学习如何量化并控制它：误差的分类，以及绝对误差与相对误差的区别。”"
                    : "“综上所述，无论是国家电网的安全运行，还是雷达导航的精准定位，都离不开对这两个核心参数的精密把控。今天这节课，我们就从工程应用的角度，系统地探究这背后的硬核技术：工频与高低频究竟该如何测量？我们又是如何用电气仪表捕捉到那肉眼看不见的‘相位差’的？”"
                  }
                </p>
              </div>
              <div className="flex items-start">
                <BookOpen className="w-5 h-5 text-teal-500 mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-teal-700 font-bold">知识点挂载完成：正式进入《{activeCourse}》章节教学环节。</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- 工作流组件: 课堂评价 ---
const ClassroomEvaluationView = ({ activeCourse }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [progress, setProgress] = useState(0);

  const diagStats = activeCourse === '第一章第4-6节 误差的表示和消除' 
    ? [ { stage: '宏观摸排 (降噪)', rate: 95 }, { stage: '中观定锚 (交叉验证)', rate: 82 }, { stage: '微观溯源 (相对误差)', rate: 45, isAlert: true }, { stage: '最终诊断与处置', rate: 88 } ]
    : [ { stage: '限幅方波生成', rate: 95 }, { stage: '微分尖脉冲提取', rate: 82 }, { stage: '单向整流滤波', rate: 45, isAlert: true }, { stage: '平均直流电平指示', rate: 88 } ];

  const voltStats = activeCourse === '第一章第4-6节 误差的表示和消除'
    ? [ { stage: '最大引用误差计算', rate: 78 }, { stage: '不同量程精度对比', rate: 35, isAlert: true }, { stage: '系统误差本质判断', rate: 92 } ]
    : [ { stage: '相位差波形比对', rate: 78 }, { stage: '过零点时间差计算', rate: 35, isAlert: true }, { stage: '相序超前滞后判定', rate: 92 } ];

  const moduleNames = activeCourse === '第一章第4-6节 误差的表示和消除'
    ? ['智能工厂配电系统故障诊断', '电压表出厂校验闯关']
    : ['微分型频率表原理演示', '相序与相位差测定'];

  useEffect(() => {
    if (progress < 100) {
      const timer = setTimeout(() => setProgress(p => Math.min(p + 3, 100)), 40);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => setIsAnalyzing(false), 600);
      return () => clearTimeout(timer);
    }
  }, [progress]);

  if (isAnalyzing) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-50/50">
        <div className="bg-white p-10 rounded-3xl shadow-xl flex flex-col items-center animate-in fade-in zoom-in duration-500 border border-slate-100 max-w-lg w-full text-center">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-teal-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
            <BrainCircuit className="w-20 h-20 text-teal-500 relative z-10 animate-bounce" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-3">AI 正在统计并分析课堂学情...</h3>
          <p className="text-slate-500 text-sm leading-relaxed px-4">
            正在深度处理【{moduleNames[0]}】与【{moduleNames[1]}】<br/>的全局行为日志与错题分布节点。
          </p>
          <div className="w-full h-3 bg-slate-100 rounded-full mt-8 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-teal-400 to-teal-600 rounded-full transition-all ease-out duration-75" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="mt-3 text-sm font-semibold text-teal-600">{progress}%</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto h-full overflow-y-auto pb-12 pr-2 custom-scrollbar animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center">
          <div className="bg-blue-50 p-4 rounded-xl mr-4"><Users className="w-8 h-8 text-blue-500" /></div>
          <div><p className="text-sm text-slate-500 font-medium mb-1">实训参与率</p><h3 className="text-2xl font-bold text-slate-800">45 / 45 <span className="text-sm font-normal text-slate-500 ml-1">人</span></h3></div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center">
          <div className="bg-teal-50 p-4 rounded-xl mr-4"><Target className="w-8 h-8 text-teal-500" /></div>
          <div><p className="text-sm text-slate-500 font-medium mb-1">平均通关用时</p><h3 className="text-2xl font-bold text-slate-800">12.5 <span className="text-sm font-normal text-slate-500 ml-1">分钟</span></h3></div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center">
          <div className="bg-purple-50 p-4 rounded-xl mr-4"><TrendingUp className="w-8 h-8 text-purple-500" /></div>
          <div><p className="text-sm text-slate-500 font-medium mb-1">首次答对率</p><h3 className="text-2xl font-bold text-slate-800">73.6 <span className="text-sm font-normal text-slate-500 ml-1">%</span></h3></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center"><Wrench className="w-5 h-5 mr-2 text-teal-500" /> {moduleNames[0]}</h3>
          <div className="space-y-5">
            {diagStats.map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-end mb-2"><span className={`text-sm font-medium ${item.isAlert ? 'text-red-600 font-bold' : 'text-slate-600'}`}>{item.stage}</span><span className={`text-sm font-bold ${item.isAlert ? 'text-red-600' : 'text-slate-800'}`}>{item.rate}%</span></div>
                <div className="w-full bg-slate-100 rounded-full h-2.5"><div className={`h-full rounded-full transition-all duration-1000 ${item.isAlert ? 'bg-red-500' : 'bg-teal-500'}`} style={{ width: `${item.rate}%` }}></div></div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center"><CheckCircle className="w-5 h-5 mr-2 text-blue-500" /> {moduleNames[1]}</h3>
          <div className="space-y-5 mt-2">
            {voltStats.map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-end mb-2"><span className={`text-sm font-medium ${item.isAlert ? 'text-red-600 font-bold' : 'text-slate-600'}`}>{item.stage}</span><span className={`text-sm font-bold ${item.isAlert ? 'text-red-600' : 'text-slate-800'}`}>{item.rate}%</span></div>
                <div className="w-full bg-slate-100 rounded-full h-2.5"><div className={`h-full rounded-full transition-all duration-1000 ${item.isAlert ? 'bg-red-500' : 'bg-blue-500'}`} style={{ width: `${item.rate}%` }}></div></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border-l-4 border-amber-400 p-6 rounded-r-2xl mb-8 shadow-sm">
        <div className="flex items-start">
          <AlertCircle className="w-6 h-6 text-amber-500 mr-3 mt-1" />
          <div>
            <h3 className="text-lg font-bold text-amber-800 mb-2">高频易错点关注</h3>
            <p className="text-amber-700 text-sm leading-relaxed mb-4">
              {activeCourse === '第一章第4-6节 误差的表示和消除' 
               ? <>系统留意到在两个实训模块中，同学们在涉及<strong>“相对误差”与“绝对误差”的辨析</strong>环节得分率相对偏低（正确率分别为 45% 与 35%），建议在此知识点增加随堂互动答疑。</>
               : <>系统留意到在两个实训模块中，同学们在涉及<strong>“脉冲电平转换”与“过零点计算”的辨析</strong>环节得分率相对偏低（正确率分别为 45% 与 35%），建议在此知识点增加随堂互动答疑。</>}
            </p>
            <div className="bg-white/60 p-4 rounded-lg border border-amber-200 text-sm text-amber-900 font-medium">
              <span className="block mb-1">💡 典型思维归因：</span>
              {activeCourse === '第一章第4-6节 误差的表示和消除'
               ? "部分同学在判断时较容易受到绝对误差数值大小的直觉影响（例如潜意识认为 0.5V 的偏差必定比 1V 的准），而暂时忽略了测量仪表所处的“量程基数”或“实际工作电流基数”，说明在工程环境下的相对性评价思维还需要进一步的引导与巩固。"
               : "部分同学在判断时较容易受到静态电路分析的直觉影响，而暂时忽略了频率与相位在时间轴上的动态微积分映射关系，说明在时域到频域的变换思维上还需要进一步的引导与巩固。"}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-800 text-white p-8 rounded-2xl shadow-lg relative overflow-hidden mt-8">
        <div className="absolute top-0 right-0 p-6 opacity-10"><BrainCircuit className="w-32 h-32" /></div>
        <div className="relative z-10">
          <h3 className="text-2xl font-bold mb-6 flex items-center text-teal-400">
            <Sparkles className="w-6 h-6 mr-2" /> Cognis AI 教学干预建议
          </h3>
          <div className="space-y-6 text-slate-300 text-base leading-loose">
            <p className="text-lg text-slate-200">
              {activeCourse === '第一章第4-6节 误差的表示和消除'
               ? "基于本次双实训的数据采集，学生在“数据清洗定锚”和“系统误差认知”上表现出了极高的素养，反映了前期理论教学的扎实。"
               : "基于本次双实训的数据采集，学生在“特征波形提取”和“相位辨识”上表现出了极高的素养，反映了前期理论教学的扎实。"}
            </p>
            <div>
              <p className="text-xl font-bold text-white mb-3">【下一步教学建议】</p>
              <ul className="list-disc pl-6 space-y-4 text-slate-200 text-lg">
                <li>
                  <strong className="text-teal-300">工程思维模式升维：</strong> 
                  {activeCourse === '第一章第4-6节 误差的表示和消除'
                   ? "在未来的新知识点教学（如后续章节的参数测量、波形分析）中，应持续向学生渗透“相对性评价”的底层思维模式。培养学生“敢于质疑传感器原始读数”的工程怀疑精神，引导他们跳出单一关注数值大小的直觉陷阱。"
                   : "在未来的新知识点教学中，应持续向学生渗透“时频映射”的底层思维模式。培养学生“透过波形看本质参数”的工程观察能力，引导他们跳出单一关注幅值的直觉陷阱。"}
                </li>
                <li>
                  <strong className="text-teal-300">个性化强化推送：</strong> 
                  {activeCourse === '第一章第4-6节 误差的表示和消除'
                   ? "已自动为错题率高的 28 名同学，在“课后-布置作业”模块池中追加了 3 道针对性的工程环境测算题，实施防遗忘训练。"
                   : "已自动为错题率高的 28 名同学，在“课后-布置作业”模块池中追加了 3 道针对性的交流电参数时域换算题，实施防遗忘训练。"}
                </li>
              </ul>
            </div>
            <div className="mt-8 pt-8 border-t border-slate-700 flex flex-col md:flex-row md:items-center bg-slate-800/50 rounded-xl">
               <span className="text-xl text-slate-300 font-bold mr-6 mb-4 md:mb-0">总体学情评定等第：</span>
               <div className="flex items-baseline flex-wrap">
                  <span className="text-6xl font-extrabold text-amber-400 drop-shadow-md">A-</span>
                  <span className="ml-4 text-lg text-slate-400 font-medium">
                    {activeCourse === '第一章第4-6节 误差的表示和消除' ? '（逻辑排障能力极佳，但在核心定量分析思维上需持续引导）' : '（物理观测能力极佳，但在核心数理变换思维上需持续引导）'}
                  </span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- 工作流组件: AI 文本生成 ---
const AIGeneratorView = ({ actionName, courseName }) => {
  const [customPrompt, setCustomPrompt] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    setGeneratedContent('');

    let basePrompt = `你是一位资深的大学电工电子技术教授，语言专业、严谨且富有启发性。当前授课章节是【${courseName}】。`;
    if (actionName === '评价结果') {
      basePrompt += `请基于本节课重难点，生成一份【学生学情评价报告模板】。包含：掌握度分析、常见易错点总结、下一步学习建议。`;
    } else {
      basePrompt += `请为本环节生成相关教学内容。`;
    }
    if (customPrompt.trim()) basePrompt += `\n\n此外，请满足以下定制化要求：${customPrompt}`;

    const result = await generateWithGemini(basePrompt);
    setGeneratedContent(result);
    setIsGenerating(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col h-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100 bg-slate-50 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex-1 w-full">
          <label className="block text-sm font-semibold text-slate-700 mb-2">定制化要求 (可选)</label>
          <textarea value={customPrompt} onChange={(e) => setCustomPrompt(e.target.value)} placeholder="例如：请重点强调该知识点在工业中的应用..." className="w-full h-12 md:h-10 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none resize-none transition-all text-slate-700"></textarea>
        </div>
        <button onClick={handleGenerate} disabled={isGenerating} className={`flex items-center justify-center px-6 py-2.5 h-10 mt-6 md:mt-0 rounded-lg font-semibold text-white transition-all ${isGenerating ? 'bg-teal-400 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700 shadow-md hover:shadow-lg'}`}>
          {isGenerating ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> 生成中...</> : <><Sparkles className="w-5 h-5 mr-2 text-yellow-300" /> AI 一键生成</>}
        </button>
      </div>

      <div className="flex-grow p-8 bg-white overflow-y-auto min-h-[400px]">
        {!generatedContent && !isGenerating && (
          <div className="h-full flex flex-col items-center justify-center text-slate-400">
            <BrainCircuit className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-lg">点击上方按钮，让 Cognis AI 为您生成【{actionName}】专属内容。</p>
          </div>
        )}
        {isGenerating && !generatedContent && (
          <div className="h-full flex flex-col items-center justify-center text-teal-600">
            <Loader2 className="w-12 h-12 mb-4 animate-spin opacity-80" />
            <p className="text-lg font-medium animate-pulse">Gemini 正在深度思考与组织内容...</p>
          </div>
        )}
        {generatedContent && <div className="prose prose-slate prose-teal max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap">{generatedContent}</div>}
      </div>
    </div>
  );
};

// --- 工作流组件: 评价结果 (大纲达成度与历史趋势报告) ---
const EvaluationReportView = ({ activeCourse }) => {
  const [isGenerating, setIsGenerating] = useState(true);

  // 定义当前课程学生的无感知测评雷达图维度与数据
  const courseRadarDimensions = useMemo(() => [
    { name: '全面度', max: 100 },
    { name: '完整度', max: 100 },
    { name: '流畅度', max: 100 },
    { name: '参与度', max: 100 },
    { name: '思政度', max: 100 },
  ], []);
  const courseRadarData = [88, 92, 85, 95, 90]; 

  useEffect(() => {
    const timer = setTimeout(() => setIsGenerating(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isGenerating) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-50/50">
        <div className="bg-white p-10 rounded-3xl shadow-xl flex flex-col items-center animate-in fade-in zoom-in duration-500 border border-slate-100 max-w-lg w-full text-center">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-indigo-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
            <Activity className="w-20 h-20 text-indigo-500 relative z-10 animate-bounce" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-3">AI 正在深度演算无感知测评数据...</h3>
          <p className="text-slate-500 text-sm leading-relaxed px-4">
            正在跨越 2024-2026 学年维度，基于【{activeCourse}】提取全班学生的互动指标，生成大纲达成度综合报告。
          </p>
          <Loader2 className="w-8 h-8 mt-6 animate-spin text-indigo-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto h-full overflow-y-auto pb-12 pr-2 custom-scrollbar animate-in fade-in duration-500">
      
      <div className="mb-8">
        <h2 className="text-2xl font-extrabold text-slate-800 flex items-center">
          <BarChart3 className="w-7 h-7 mr-3 text-indigo-600" /> 
          全景无感知测评与大纲达成度报告
        </h2>
        <p className="text-slate-500 mt-2 ml-10">基于学生的实训交互日志、错题滞留时长、提问特征等无感知数据，AI 自动映射的毕业要求指标点达成情况。</p>
      </div>

      {/* 模块一：指标 3.2 与 6.2 总体达成对比图 */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8 flex flex-col lg:flex-row">
        <div className="lg:w-1/2 p-8 border-b lg:border-b-0 lg:border-r border-slate-100 bg-slate-50/50">
           <h3 className="text-lg font-bold text-slate-700 mb-6 flex items-center">
             <Target className="w-5 h-5 mr-2 text-indigo-500" /> 本届学生核心指标总体达成度
           </h3>
           
           {/* CSS 自定义三环形进度图 */}
           <div className="flex justify-center gap-6 items-end mt-8">
              {/* 指标 3.2 环形图 */}
              <div className="flex flex-col items-center">
                 <div className="relative w-24 h-24">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                       <circle cx="50" cy="50" r="40" fill="transparent" stroke="#e2e8f0" strokeWidth="10" />
                       <circle cx="50" cy="50" r="40" fill="transparent" stroke="#0ea5e9" strokeWidth="10" strokeDasharray="251.2" strokeDashoffset="251.2 * (1 - 0.85)" className="transition-all duration-1000 ease-out" style={{strokeDashoffset: 251.2 * (1 - 0.85)}} strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                       <span className="text-xl font-extrabold text-slate-800">85<span className="text-xs font-medium text-slate-500">%</span></span>
                    </div>
                 </div>
                 <span className="mt-3 font-bold text-slate-600 text-xs">指标 3.2</span>
                 <span className="text-[10px] text-slate-400 mt-0.5">权重 33%</span>
              </div>

              {/* 指标 6.2 环形图 */}
              <div className="flex flex-col items-center">
                 <div className="relative w-24 h-24">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                       <circle cx="50" cy="50" r="40" fill="transparent" stroke="#e2e8f0" strokeWidth="10" />
                       <circle cx="50" cy="50" r="40" fill="transparent" stroke="#10b981" strokeWidth="10" strokeDasharray="251.2" strokeDashoffset="251.2 * (1 - 0.78)" className="transition-all duration-1000 ease-out delay-300" style={{strokeDashoffset: 251.2 * (1 - 0.78)}} strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                       <span className="text-xl font-extrabold text-slate-800">78<span className="text-xs font-medium text-slate-500">%</span></span>
                    </div>
                 </div>
                 <span className="mt-3 font-bold text-slate-600 text-xs">指标 6.2</span>
                 <span className="text-[10px] text-slate-400 mt-0.5">权重 67%</span>
              </div>

              {/* 综合达成度 环形图 */}
              <div className="flex flex-col items-center ml-2 border-l border-slate-200 pl-6">
                 <div className="relative w-32 h-32">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                       <circle cx="50" cy="50" r="40" fill="transparent" stroke="#e2e8f0" strokeWidth="10" />
                       <circle cx="50" cy="50" r="40" fill="transparent" stroke="#8b5cf6" strokeWidth="10" strokeDasharray="251.2" strokeDashoffset="251.2 * (1 - 0.80)" className="transition-all duration-1000 ease-out delay-500" style={{strokeDashoffset: 251.2 * (1 - 0.80)}} strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                       <span className="text-3xl font-extrabold text-slate-800">80<span className="text-sm font-medium text-slate-500">%</span></span>
                       <span className="text-xs text-violet-600 font-bold bg-violet-50 px-2 py-0.5 rounded mt-1">良好</span>
                    </div>
                 </div>
                 <span className="mt-4 font-extrabold text-slate-800 text-sm">综合达成度</span>
              </div>
           </div>
        </div>

        <div className="lg:w-1/2 p-8 bg-white relative overflow-hidden">
           <div className="absolute top-0 right-0 p-6 opacity-5"><BrainCircuit className="w-32 h-32 text-indigo-500" /></div>
           <h3 className="text-lg font-bold text-indigo-900 mb-4 flex items-center relative z-10">
             <Sparkles className="w-5 h-5 mr-2 text-indigo-500" /> AI 横向能力评估
           </h3>
           <div className="space-y-3 relative z-10">
             <div className="bg-indigo-50/70 p-3.5 rounded-xl border border-indigo-100">
               <h4 className="font-bold text-indigo-800 text-sm mb-1">指标 3.2（多条件制约系统实施）</h4>
               <p className="text-xs text-slate-600 leading-relaxed">
                 <span className="text-indigo-600 font-semibold mr-1">AI 洞察：</span>
                 85%的学生一次性调通测量方案，展现出极强的<strong className="text-indigo-700">工程约束应对能力</strong>。
               </p>
             </div>
             <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-100">
               <h4 className="font-bold text-emerald-800 text-sm mb-1">指标 6.2（复杂工程方案制定）</h4>
               <p className="text-xs text-slate-600 leading-relaxed">
                 <span className="text-emerald-600 font-semibold mr-1">AI 洞察：</span>
                 整体溯源思路清晰，但在“制定全局方案”的开阔性思维上仍有少数出现遗漏，<strong className="text-emerald-700">具备较大上升潜力</strong>。
               </p>
             </div>
             <div className="bg-violet-50/70 p-3.5 rounded-xl border border-violet-100">
               <h4 className="font-bold text-violet-800 text-sm mb-1">综合达成度（加权评估）</h4>
               <p className="text-xs text-slate-600 leading-relaxed">
                 <span className="text-violet-600 font-semibold mr-1">AI 总结：</span>
                 经加权计算，综合达成率稳定在 <strong className="text-violet-700">80% (良好)</strong>。这表明整体教学目标已稳步实现，未来发力大占比的方案制定指标，将是核心引擎。
               </p>
             </div>
           </div>
        </div>
      </div>

      {/* 模块二：2024-2026 历史达成度趋势曲线图 */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col lg:flex-row mb-8">
        <div className="lg:w-7/12 p-8 border-b lg:border-b-0 lg:border-r border-slate-100 bg-slate-900 text-white relative">
           <h3 className="text-lg font-bold text-slate-100 mb-6 flex items-center">
             <TrendingUp className="w-5 h-5 mr-2 text-teal-400" /> 近三年《{activeCourse.split(' ')[1] || '误差与频率'}》指标达成率趋势
           </h3>
           
           {/* SVG 趋势折线图 */}
           <div className="w-full h-[220px] mt-4 relative">
             <svg viewBox="0 0 500 200" className="w-full h-full overflow-visible">
                {/* 网格线与Y轴刻度 */}
                <line x1="40" y1="160" x2="480" y2="160" stroke="#334155" strokeWidth="1" />
                <line x1="40" y1="110" x2="480" y2="110" stroke="#334155" strokeWidth="1" strokeDasharray="4" />
                <line x1="40" y1="60" x2="480" y2="60" stroke="#334155" strokeWidth="1" strokeDasharray="4" />
                <line x1="40" y1="10" x2="480" y2="10" stroke="#334155" strokeWidth="1" strokeDasharray="4" />
                
                <text x="30" y="164" fill="#64748b" fontSize="10" textAnchor="end">50%</text>
                <text x="30" y="114" fill="#64748b" fontSize="10" textAnchor="end">70%</text>
                <text x="30" y="64" fill="#64748b" fontSize="10" textAnchor="end">90%</text>
                <text x="30" y="14" fill="#64748b" fontSize="10" textAnchor="end">100%</text>

                {/* X轴刻度 */}
                <text x="100" y="185" fill="#94a3b8" fontSize="12" textAnchor="middle" fontWeight="bold">2024届</text>
                <text x="290" y="185" fill="#94a3b8" fontSize="12" textAnchor="middle" fontWeight="bold">2025届</text>
                <text x="480" y="185" fill="#e2e8f0" fontSize="12" textAnchor="middle" fontWeight="bold">2026届 (本届)</text>

                {/* 数据线：指标3.2 (65%, 74%, 85%) -> y坐标: 122.5, 100, 72.5 (100%在y=10, 50%在y=160) */}
                <path d="M 100 115 L 290 88 L 480 55" fill="none" stroke="#0ea5e9" strokeWidth="3" className="animate-[dash_2s_ease-out_forwards]" strokeDasharray="1000" strokeDashoffset="0" />
                <circle cx="100" cy="115" r="5" fill="#0ea5e9" stroke="#0f172a" strokeWidth="2" />
                <circle cx="290" cy="88" r="5" fill="#0ea5e9" stroke="#0f172a" strokeWidth="2" />
                <circle cx="480" cy="55" r="6" fill="#0ea5e9" stroke="#fff" strokeWidth="2" />
                <text x="480" y="42" fill="#38bdf8" fontSize="12" textAnchor="middle" fontWeight="bold">3.2 (85%)</text>

                {/* 数据线：指标6.2 (60%, 68%, 78%) -> y坐标: 130, 106, 76 */}
                <path d="M 100 130 L 290 106 L 480 76" fill="none" stroke="#10b981" strokeWidth="3" className="animate-[dash_2s_ease-out_forwards]" strokeDasharray="1000" strokeDashoffset="0" />
                <circle cx="100" cy="130" r="5" fill="#10b981" stroke="#0f172a" strokeWidth="2" />
                <circle cx="290" cy="106" r="5" fill="#10b981" stroke="#0f172a" strokeWidth="2" />
                <circle cx="480" cy="76" r="6" fill="#10b981" stroke="#fff" strokeWidth="2" />
                <text x="480" y="93" fill="#34d399" fontSize="12" textAnchor="middle" fontWeight="bold">6.2 (78%)</text>
             </svg>
             <style dangerouslySetInnerHTML={{__html: `
                @keyframes dash { from { stroke-dashoffset: 1000; } to { stroke-dashoffset: 0; } }
             `}} />
           </div>

           {/* 图例 */}
           <div className="flex justify-center gap-6 mt-2">
              <div className="flex items-center text-xs font-medium text-slate-300"><div className="w-3 h-3 bg-sky-500 rounded-full mr-2"></div>指标 3.2 达成率</div>
              <div className="flex items-center text-xs font-medium text-slate-300"><div className="w-3 h-3 bg-emerald-500 rounded-full mr-2"></div>指标 6.2 达成率</div>
           </div>
        </div>

        <div className="lg:w-5/12 p-8 bg-white relative overflow-hidden flex flex-col justify-center">
           <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
             <BrainCircuit className="w-6 h-6 mr-2 text-teal-500" /> AI 纵向趋势诊断
           </h3>
           <div className="space-y-5">
             <p className="text-sm text-slate-600 leading-relaxed">
               纵观连续三届（2024-2026）的学情跟踪数据，该堂课的核心指标达成率呈现出<strong>强劲的逐年上升趋势</strong>。
             </p>
             <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <span className="font-bold text-teal-700 text-sm mb-2 block">🎯 AI 归因归纳：</span>
                <ul className="text-sm text-slate-600 space-y-2 list-disc pl-4 marker:text-teal-400">
                  <li>自 2025 年引入<strong>“故障排查互动沙盘”</strong>以来，指标 3.2（系统实施）实现了一次跃升（+9%）。</li>
                  <li>今年（2026届）全面启用了 <strong>AI 引导式纠错体系</strong>，大幅降低了学生的试错成本，使指标 6.2（科学方法与方案制定）达成了历史最佳增幅（+10%）。</li>
                </ul>
             </div>
             <p className="text-sm font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-lg inline-block border border-indigo-100">
               预测模型：若持续加深当前教改路径，明年的达成率有望全面突破 90% 阈值。
             </p>
           </div>
        </div>
      </div>

      {/* 模块三：当前课程学生互动特征雷达图与综合评价 */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col lg:flex-row">
        <div className="lg:w-1/2 p-8 border-b lg:border-b-0 lg:border-r border-slate-100 flex flex-col items-center justify-center">
           <h3 className="text-lg font-bold text-slate-700 mb-8 w-full text-left flex items-center">
             <Activity className="w-5 h-5 mr-2 text-rose-500" /> 学生无感知互动特征测绘
           </h3>
           <div className="flex-grow flex items-center justify-center w-full">
             <RadarChart data={courseRadarData} dimensions={courseRadarDimensions} size={320} />
           </div>
        </div>
        <div className="lg:w-1/2 p-8 bg-slate-50 relative overflow-hidden flex flex-col justify-center">
           <div className="absolute top-0 right-0 p-6 opacity-5"><BrainCircuit className="w-32 h-32 text-rose-500" /></div>
           <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center relative z-10">
             <Sparkles className="w-6 h-6 mr-2 text-rose-500" /> AI 总体综合评价
           </h3>
           <div className="space-y-5 relative z-10">
             <p className="text-sm text-slate-600 leading-relaxed">
               基于对本节课【{activeCourse}】中所有学生的沙盘交互埋点、页面停留时长、错题修正路径以及思政问题回答等无感知数据进行深度演算，得出以下结论：
             </p>
             <div className="bg-white p-5 rounded-xl border border-rose-100 shadow-sm">
                <ul className="text-sm text-slate-700 space-y-3">
                  <li className="flex items-start">
                    <span className="text-rose-500 mr-2">●</span>
                    <span><strong>参与度 (95) 与 思政度 (90) 表现极其优异：</strong>学生对引入的热点和思政话题共鸣强烈，带入感极佳，课堂互动频次与热度远超历史均值。</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-rose-500 mr-2">●</span>
                    <span><strong>完整度 (92) 与 全面度 (88) 稳步达标：</strong>绝大部分学生能够沉浸式跟进到底，并按规范完成整个排障或测定流程，未出现大规模中途放弃的现象。</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-500 mr-2">●</span>
                    <span><strong>流畅度 (85) 具有细节优化空间：</strong>部分学生在面对底层的核心计算转换（如相对误差的基数代入、过零点时间的辨析）时，操作停顿和修改频率较高。</span>
                  </li>
                </ul>
             </div>
             <p className="text-sm font-bold text-rose-700 bg-rose-50 px-4 py-3 rounded-lg border border-rose-200">
               🌟 AI 最终评定：本堂课教学设计极为成功。思政融合有效激发了内在驱动力，实践操作高质完成；仅需在个别微观的理论跨越点上增设“降维阶梯”，即可达成全流程无死角闭环。
             </p>
           </div>
        </div>
      </div>
      
    </div>
  );
};

// --- 工作流组件: 布置作业 ---
const HomeworkAssignmentView = ({ activeCourse, isAssigned, setAssigned }) => {
  const [isDistributing, setIsDistributing] = useState(!isAssigned);
  const [progress, setProgress] = useState(isAssigned ? 100 : 0);
  const [isQuestionExpanded, setIsQuestionExpanded] = useState(true);
  
  // 新增：用于跟踪当前被选中查看批改详情的学生
  const [selectedStudent, setSelectedStudent] = useState(null);

  // 新增：AI 对话框状态
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    const newUserMsg = { role: 'user', content: chatInput };
    setChatMessages(prev => [...prev, newUserMsg]);
    setChatInput('');
    setIsChatLoading(true);

    setTimeout(() => {
        const aiResponse = {
            role: 'ai',
            content: `已为您汇总本次作业的学情数据并深度对标教学大纲。\n\n🎯 **【一】作业错误集中点与学情亮点**\n1. **基础理论扎实，正向工程思维过渡**：绝大多数同学准确掌握了误差的基本计算公式。仅有部分错题集中在“测量表量程适配性”的判断上，这说明学生们正在经历从“理想物理环境”向“复杂工业系统约束”的思维跃升期。\n2. **具备初步的系统性评判意识**：在对比不同仪表方案时，多数学生已经能够有意识地建立评判标准，仅需在“绝对误差”与“相对误差”的灵活转换上稍微加深引导即可。\n\n📊 **【二】教学大纲核心指标达成度诊断**\n\n**➤ 指标 3.2 达成度评估：优秀 (A-)**\n> *【指标要求】：能够考虑多种制约条件，对单元功能电路、功能软件程序、工艺流程进行开发或实施，并按方案进行联调联试，呈现开发或实施效果，在此过程中体现创新。*\n**💡 诊断依据**：本题考查学生在选型时对现场多种制约条件的考量。数据表明，班级绝大多数学生能够自主识别基本的电路约束条件，并在实施方案的对比中体现出了积极的探索与创新思维。通过纠正少量错题，学生将完美达成该指标对“多重制约条件考量”的要求。\n\n**➤ 指标 6.2 达成度评估：良好 (B+)**\n> *【指标要求】：能够综合运用科学原理并采用科学方法，掌握复杂电力系统工程问题的研究现状和发展趋势，制定实验方案；*\n**💡 诊断依据**：在面对模拟复杂电力系统的工程场景时，学生们能够较好地综合运用误差科学原理。虽然在制定极其严密的实验及选型方案时，少部分学生科学方法的系统性还需完善，但整体研究思路清晰，达成度稳步向好。\n\n🚀 **【三】AI 自动干预与教案进阶建议**\n同学们的整体表现非常出色！建议在后续的【上课模式】实训沙盘中，顺势引入“带干扰噪声的电路模型”和“极端工况突变”，这将成为拔高上限的关键一步，轻松助力班级核心指标达成率突破 95%！`
        };
        setChatMessages(prev => [...prev, aiResponse]);
        setIsChatLoading(false);
    }, 2500);
  };

  const students = useMemo(() => {
    const surnames = ['赵', '钱', '孙', '李', '周', '吴', '郑', '王', '冯', '陈', '卫', '蒋', '沈', '韩', '杨', '朱', '秦', '尤', '许', '何', '吕', '施', '张', '孔', '曹', '严', '华', '金', '魏', '陶', '姜', '戚', '谢', '邹', '喻', '柏', '水', '窦', '章', '云', '苏', '潘', '葛', '奚', '范'];
    const givenNames = ['伟', '芳', '娜', '敏', '静', '秀英', '丽', '强', '磊', '洋', '艳', '杰', '娟', '涛', '明', '超', '霞', '平', '刚', '建国', '晓明', '华', '梅', '萍', '玲', '云', '玉', '红', '波', '燕', '飞', '峰', '健', '斌', '辉', '鹏', '雷', '兵', '星宇', '浩宇', '子轩', '梓涵', '佳琪', '诗雅', '欣怡'];
    const grades = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-'];
    return Array.from({ length: 45 }).map((_, index) => {
      const isSubmitted = index < 37;
      return { 
        id: `20261${(index + 1).toString().padStart(4, '0')}`, 
        name: surnames[index] + givenNames[index], 
        status: isSubmitted ? '已提交' : '未提交', 
        score: isSubmitted ? grades[(index * 7 + 3) % grades.length] : '-' 
      };
    });
  }, []);

  const stats = useMemo(() => {
    const total = students.length;
    const submittedList = students.filter(s => s.status === '已提交');
    const submitted = submittedList.length;
    const progressPercent = Math.round((submitted / total) * 100);
    
    // 统计出现频率最高的等级作为众数平均等第展示
    const gradeCounts = {};
    let maxCount = 0;
    let avgScore = '-';
    submittedList.forEach(s => {
        gradeCounts[s.score] = (gradeCounts[s.score] || 0) + 1;
        if (gradeCounts[s.score] > maxCount) {
            maxCount = gradeCounts[s.score];
            avgScore = s.score;
        }
    });
    
    return { total, submitted, avgScore: submitted > 0 ? avgScore : '-', progressPercent };
  }, [students]);

  useEffect(() => {
    if (isAssigned) return;
    if (progress < 100) {
      const timer = setTimeout(() => setProgress(p => Math.min(p + 4, 100)), 60);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setIsDistributing(false);
        if (setAssigned) setAssigned(true);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [progress, isAssigned, setAssigned]);

  if (isDistributing) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-50/50">
        <div className="bg-white p-10 rounded-3xl shadow-xl flex flex-col items-center animate-in fade-in zoom-in duration-500 border border-slate-100 max-w-lg w-full text-center">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-indigo-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
            <BrainCircuit className="w-20 h-20 text-indigo-500 relative z-10 animate-bounce" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-3">AI 正在智能布置作业...</h3>
          <p className="text-slate-500 text-sm leading-relaxed px-4">
            正在基于【{activeCourse}】的学情画像，<br/>为 45 名学生匹配并分发千人千面的课后练习。
          </p>
          <div className="w-full h-3 bg-slate-100 rounded-full mt-8 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-full transition-all ease-out duration-75" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="mt-3 text-sm font-semibold text-indigo-600">{progress}%</div>
        </div>
      </div>
    );
  }

  const isCourseA = activeCourse === '第一章第4-6节 误差的表示和消除';

  return (
    <div className="w-full max-w-6xl mx-auto h-full overflow-y-auto pb-12 pr-2 custom-scrollbar animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
          <div><p className="text-sm text-slate-500 font-medium mb-1">班级总人数</p><h3 className="text-3xl font-bold text-slate-800">{stats.total} <span className="text-sm font-normal text-slate-500 ml-1">人</span></h3></div>
          <div className="bg-slate-50 p-4 rounded-xl"><Users className="w-8 h-8 text-slate-400" /></div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-center relative overflow-hidden">
          <div className="flex justify-between items-center mb-3 relative z-10">
            <div><p className="text-sm text-slate-500 font-medium mb-1">作业完成进度</p><h3 className="text-3xl font-bold text-slate-800">{stats.submitted} <span className="text-lg text-slate-400 font-normal">/ {stats.total}</span></h3></div>
            <div className="bg-indigo-50 p-4 rounded-xl"><FileSpreadsheet className="w-8 h-8 text-indigo-500" /></div>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 relative z-10"><div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${stats.progressPercent}%` }}></div></div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
          <div><p className="text-sm text-slate-500 font-medium mb-1">AI 评分</p><h3 className="text-3xl font-bold text-slate-800">{stats.avgScore} <span className="text-sm font-normal text-slate-500 ml-1">等第</span></h3></div>
          <div className="bg-teal-50 p-4 rounded-xl"><TrendingUp className="w-8 h-8 text-teal-500" /></div>
        </div>
      </div>

      {/* AI 学情总结与大纲达成度分析助手 */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="text-lg font-bold text-slate-800 flex items-center">
            <MessageSquare className="w-5 h-5 mr-2 text-indigo-500" /> AI 学情总结与大纲达成度分析助手
          </h3>
        </div>
        <div className="p-6 bg-slate-50/50 flex flex-col h-[550px]">
          <div className="flex-grow overflow-y-auto custom-scrollbar pr-4 space-y-6 mb-4">
            {chatMessages.length === 0 && (
               <div className="flex flex-col items-center justify-center h-full text-slate-400 text-center">
                  <BrainCircuit className="w-16 h-16 mb-4 text-indigo-200" />
                  <p className="text-base font-medium mb-3">您可以在此向 Cognis AI 发出大纲指标分析指令</p>
                  <p 
                    className="text-indigo-600 cursor-pointer bg-indigo-50 border border-indigo-100 px-4 py-2 rounded-full text-sm hover:bg-indigo-100 transition-colors shadow-sm" 
                    onClick={() => setChatInput('给我统计本次作业错误集中点，并分析大纲中 3.2 和 6.2 这两个指标的达成度。')}
                  >
                    💡 试着问：“给我统计本次作业错误集中点，并分析大纲中 3.2 和 6.2 这两个指标的达成度。”
                  </p>
               </div>
            )}
            {chatMessages.map((msg, idx) => (
               <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                     <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${msg.role === 'user' ? 'bg-indigo-100 ml-4 border border-indigo-200' : 'bg-teal-100 mr-4 border border-teal-200'}`}>
                        {msg.role === 'user' ? <User className="w-6 h-6 text-indigo-600" /> : <BrainCircuit className="w-6 h-6 text-teal-600" />}
                     </div>
                     <div className={`p-5 rounded-2xl text-[15px] leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none'}`}>
                        {msg.content.split('\n').map((line, i) => (
                            <React.Fragment key={i}>
                                {line.startsWith('>') ? (
                                    <span className="block border-l-4 border-slate-300 pl-3 text-slate-500 italic my-2">{line.substring(1)}</span>
                                ) : line.includes('**') ? (
                                    <span dangerouslySetInnerHTML={{__html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}}></span>
                                ) : (
                                    <span>{line}</span>
                                )}
                                <br />
                            </React.Fragment>
                        ))}
                     </div>
                  </div>
               </div>
            ))}
            {isChatLoading && (
               <div className="flex justify-start">
                  <div className="flex flex-row max-w-[85%]">
                     <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-teal-100 mr-4 border border-teal-200 shadow-sm">
                        <BrainCircuit className="w-6 h-6 text-teal-600" />
                     </div>
                     <div className="p-5 rounded-2xl text-[15px] leading-relaxed bg-white border border-slate-200 text-slate-500 rounded-tl-none shadow-sm flex items-center">
                        <Loader2 className="w-5 h-5 mr-3 animate-spin text-teal-500" /> AI 正在深度挖掘学情数据并计算大纲指标映射度...
                     </div>
                  </div>
               </div>
            )}
          </div>
          <div className="flex items-center bg-white border border-slate-200 rounded-xl p-2 shadow-sm transition-all focus-within:ring-2 focus-within:ring-indigo-500">
             <input 
                type="text" 
                value={chatInput} 
                onChange={e => setChatInput(e.target.value)} 
                onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                placeholder="向 AI 助教输入大纲达成度分析指令..." 
                className="flex-grow px-4 py-2 bg-transparent outline-none text-slate-700 text-[15px]"
             />
             <button 
                onClick={handleSendMessage}
                disabled={!chatInput.trim() || isChatLoading}
                className={`p-3 rounded-lg transition-all flex-shrink-0 ${chatInput.trim() && !isChatLoading ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md transform hover:-translate-y-0.5' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
             >
                <Send className="w-5 h-5" />
             </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => setIsQuestionExpanded(!isQuestionExpanded)}>
          <h3 className="text-lg font-bold text-slate-800 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-indigo-500" /> 
            本次作业题目：{isCourseA ? '伺服电机电流表选型分析' : '电网工频监测与频率表选型分析'}
          </h3>
          {isQuestionExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
        </div>
        {isQuestionExpanded && (
          <div className="p-6 bg-white text-slate-700 leading-relaxed text-base flex flex-col lg:flex-row gap-6">
            <div className="flex-1 space-y-4">
              {isCourseA ? (
                <>
                  <p>在电气控制柜设计中，我们需要对一台关键伺服电机的运行电流进行实时监测。<br/>已知该电机在正常额定工况下的工作电流约为 <strong>8A</strong>。</p>
                  <p>现在仓库中有两款不同规格的指针式电流表备件，作为电气工程师，你需要通过严谨的误差分析来决定使用哪一款仪表。</p>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="font-bold mb-2">仪表参数：</p>
                    <ul className="list-disc pl-5 space-y-1 text-slate-600">
                      <li><strong>电流表 A</strong>：量程 0~10A，精度等级 1.5 级。</li>
                      <li><strong>电流表 B</strong>：量程 0~100A，精度等级 0.5 级。</li>
                    </ul>
                  </div>
                </>
              ) : (
                <>
                  <p>在电气控制系统中，我们需要对核心电网的运行频率进行实时监测。<br/>已知该电网在正常额定工况下的工作频率严格要求在 <strong>50Hz</strong>。</p>
                  <p>现在仓库中有两款不同规格的指针式频率表备件，作为电气工程师，你需要通过严谨的误差分析来决定使用哪一款仪表。</p>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="font-bold mb-2">仪表参数：</p>
                    <ul className="list-disc pl-5 space-y-1 text-slate-600">
                      <li><strong>频率表 A</strong>：量程 45~55Hz，精度等级 1.5 级。</li>
                      <li><strong>频率表 B</strong>：量程 0~100Hz，精度等级 0.5 级。</li>
                    </ul>
                  </div>
                </>
              )}
            </div>
            <div className="w-full lg:w-1/3"><QuestionImage /></div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="text-lg font-bold text-slate-800 flex items-center"><FileQuestion className="w-5 h-5 mr-2 text-indigo-500" /> 作业提交详情清单</h3>
          <span className="text-sm text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">共计 45 人</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/50 border-b border-slate-200 text-slate-500 font-medium">
              <tr><th className="px-6 py-4">学号</th><th className="px-6 py-4">姓名</th><th className="px-6 py-4">提交状态</th><th className="px-6 py-4">作业分数</th><th className="px-6 py-4 text-center">操作</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map((student, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-slate-500">{student.id}</td>
                  <td className="px-6 py-4 font-semibold text-slate-700">{student.name}</td>
                  <td className="px-6 py-4">
                    {student.status === '已提交' ? <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-teal-50 text-teal-700 border border-teal-200"><CheckCircle2 className="w-3.5 h-3.5 mr-1" /> 已提交</span> : <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200"><Clock className="w-3.5 h-3.5 mr-1" /> 未提交</span>}
                  </td>
                  <td className="px-6 py-4"><span className={`font-bold ${student.score?.startsWith && student.score.startsWith('A') ? 'text-teal-600' : student.score?.startsWith && student.score.startsWith('B') ? 'text-blue-600' : student.score === '-' ? 'text-slate-300' : 'text-amber-600'}`}>{student.score}</span></td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      disabled={student.status === '未提交'} 
                      onClick={() => setSelectedStudent(student)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded transition-colors ${student.status === '已提交' ? 'bg-slate-100 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700' : 'bg-slate-50 text-slate-300 cursor-not-allowed'}`}
                    >
                      查看批改
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 学生作业详情弹窗 */}
      {selectedStudent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div className="flex items-center">
                <div className="bg-indigo-100 p-2 rounded-lg mr-3">
                  <User className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 flex items-center">
                    {selectedStudent.name} <span className="ml-2 text-xs font-medium text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded">{selectedStudent.id}</span>
                  </h4>
                </div>
              </div>
              <button onClick={() => setSelectedStudent(null)} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-md hover:bg-slate-200 transition-colors"><X className="w-5 h-5" /></button>
            </div>

            <div className="p-6 overflow-y-auto flex-grow custom-scrollbar">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-sm font-bold text-slate-500 mb-1">系统综合评分</p>
                  <div className="flex items-baseline">
                    <span className={`text-5xl font-extrabold ${selectedStudent.score?.startsWith('A') ? 'text-teal-500' : selectedStudent.score?.startsWith('B') ? 'text-blue-500' : 'text-amber-500'}`}>
                      {selectedStudent.score}
                    </span>
                    <span className="text-lg font-medium text-slate-400 ml-2">级</span>
                  </div>
                </div>
                <div className="bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-100 flex items-center">
                  <BrainCircuit className="w-5 h-5 text-indigo-500 mr-2" />
                  <span className="text-sm font-bold text-indigo-700">AI 智能阅卷完毕</span>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 mb-6">
                <h5 className="font-bold text-slate-700 mb-3 flex items-center text-sm">
                  <FileText className="w-4 h-4 mr-2 text-slate-400" /> 学生答案
                </h5>
                <div className="font-mono text-sm text-slate-600 bg-white p-4 rounded-lg border border-slate-100 shadow-sm leading-relaxed">
                  {isCourseA ? (
                    <>
                      <p className="mb-3"><strong>1. 最终选择仪表:</strong> <span className="text-emerald-600 font-bold">电流表 A (0~10A, 1.5级) ✔️</span></p>
                      <p className="mb-3"><strong>2. 绝对误差的概念解释:</strong> <br/><span className="text-slate-500">绝对误差是指仪表的测量显示值与被测量真实值之间的代数差值，通常用来评估实际测量的准确程度。</span></p>
                      <p><strong>3. 具体计算过程:</strong> <br/>
                        <span className="text-red-500 line-through">
                          &nbsp;&nbsp;&nbsp;表A的最大绝对误差：ΔA = 8A × 1.5% = 0.12A <br/>
                          &nbsp;&nbsp;&nbsp;表B的最大绝对误差：ΔB = 8A × 0.5% = 0.04A
                        </span><br/>
                        <span className="text-amber-600 text-xs mt-2 block">（注：虽然算出来表B误差更小，但因为被测电流是8A，我觉得表A的量程最合适，所以没采纳计算结果，直接盲猜了表A。）</span>
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="mb-3"><strong>1. 最终选择仪表:</strong> <span className="text-emerald-600 font-bold">频率表 A (45~55Hz, 1.5级) ✔️</span></p>
                      <p className="mb-3"><strong>2. 绝对误差的概念解释:</strong> <br/><span className="text-slate-500">绝对误差是指仪表的实际指示频率与电网真实频率之间的偏离量，体现了仪表的绝对测量精度。</span></p>
                      <p><strong>3. 具体计算过程:</strong> <br/>
                        <span className="text-red-500 line-through">
                          &nbsp;&nbsp;&nbsp;表A的最大绝对误差：ΔA = 50Hz × 1.5% = 0.75Hz <br/>
                          &nbsp;&nbsp;&nbsp;表B的最大绝对误差：ΔB = 50Hz × 0.5% = 0.25Hz
                        </span><br/>
                        <span className="text-amber-600 text-xs mt-2 block">（注：50Hz的电网不可能波动到0或100Hz，表B的量程太宽了肯定是出题陷阱，所以我没看计算结果，直接选了表A。）</span>
                      </p>
                    </>
                  )}
                </div>
              </div>

              <div className="bg-amber-50 rounded-xl p-5 border border-amber-200">
                <h5 className="font-bold text-amber-800 mb-3 flex items-center text-sm">
                  <AlertCircle className="w-4 h-4 mr-2 text-amber-500" /> 错因分析与纠正建议
                </h5>
                <p className="text-sm text-amber-700 leading-relaxed mb-4">
                  {isCourseA 
                    ? "该生虽然凭直觉幸运地选对了【电流表 A】，但在计算过程中概念完全混淆。他将“被测真实值(8A)”作为基数来乘以精度等级，这是错误的！最大绝对误差的计算基数必须是【仪表的满量程(10A或100A)】。这说明该生对绝对误差与引用误差的转换公式死记硬背，未理解本质。" 
                    : "该生虽然凭借直觉排除了【频率表 B】，但在计算过程中发生了严重的逻辑错误。他错误地将“被测频率(50Hz)”作为基数计算误差。对于频率表而言，其最大绝对误差的基数必须是【量程的跨度(即上限减下限，55-45=10Hz)】。这暴露出该生缺乏对量程跨度概念的掌握。"}
                </p>
                <div className="bg-white/60 p-3 rounded-lg border border-amber-100 text-sm text-amber-900 font-medium">
                  <strong>AI 辅导推送：</strong> 已向该生自动推送《{isCourseA ? '量程选择与最大绝对误差测算标准' : '仪表测量范围与跨度的概念辨析'}》微课视频及重做练习。
                </div>
              </div>

            </div>
            
            <div className="px-6 py-4 border-t border-slate-100 bg-white flex justify-end">
              <button onClick={() => setSelectedStudent(null)} className="px-6 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors">
                关闭预览
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- 工作流组件: 题图生成 ---
const QuestionImage = () => {
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchImage = async () => {
      const apiKey = "";
      const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${apiKey}`;
      const promptText = "A photorealistic, highly detailed close-up photograph of an industrial electrical control cabinet panel. The panel features a classic analog pointer ammeter and servo drive indicators. Authentic factory lighting, real-world textures, 8k resolution, professional photography.";
      
      const payload = { instances: { prompt: promptText }, parameters: { sampleCount: 1 } };

      try {
        const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        const result = await response.json();
        const base64 = result.predictions?.[0]?.bytesBase64Encoded;
        if (base64) setImageUrl(`data:image/png;base64,${base64}`);
      } catch (error) {
        console.error("Image generation failed:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchImage();
  }, []);

  if (isLoading) return <div className="w-full h-full min-h-[14rem] bg-slate-50 animate-pulse rounded-xl flex flex-col items-center justify-center text-slate-400 border border-slate-200"><Loader2 className="w-6 h-6 animate-spin mb-3 text-indigo-400" /><span className="text-sm font-medium text-center">正在渲染真实工业场景图...</span></div>;
  if (!imageUrl) return null;

  return (
    <div className="relative group w-full h-full min-h-[14rem] rounded-xl overflow-hidden shadow-sm border border-slate-200 bg-black">
      <img src={imageUrl} alt="Industrial Control Cabinet" className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
      <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white/90 text-xs px-2 py-1 rounded flex items-center"><Sparkles className="w-3 h-3 mr-1 text-yellow-400" />AI Generated</div>
    </div>
  );
};

// --- 工作流容器: 备课/上课/课后 子页面 ---
const SubPageView = ({ title, icon: Icon, colorClass, isAnimating, navigateTo, completedModules, isCourseBuilt, setIsCourseBuilt, ideologicalState, caseGenerationState, activeCourse, setActiveCourse, homeworkState, evaluationState }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedCourseTemp, setSelectedCourseTemp] = useState(null);

  const [prepPhase, setPrepPhase] = useState(() => {
    if (title !== '备课') return 'grid';
    return 'knowledgeList'; // 默认显示知识点列表
  });
  
  const [expandedCourseOutline, setExpandedCourseOutline] = useState(null);
  const [expandedKnowledgePoint, setExpandedKnowledgePoint] = useState(null);
  
  const [knowledgePoints, setKnowledgePoints] = useState({
      "第一章第4-6节 误差的表示和消除": "误差的分类（系统误差，随机误差，数据误差）\n绝对误差\n相对误差\n引用误差",
      "第四章第1-5节 频率与相位的测量": "工频测量\n高低频测量\n电动系频率表\n变换式频率表"
  });
  
  const [selectedFiles, setSelectedFiles] = useState([]);

  useEffect(() => {
    if (title !== '备课') {
      setPrepPhase('grid');
    }
  }, [title]);

  useEffect(() => {
    if (prepPhase === 'building') {
      const timer = setTimeout(() => {
        setPrepPhase('grid');
        if (setIsCourseBuilt) setIsCourseBuilt(true); 
      }, 2500); 
      return () => clearTimeout(timer);
    }
  }, [prepPhase, setIsCourseBuilt]);

  const handleCourseClick = (course) => {
    setSelectedCourseTemp(course);
    setShowModal(true);
  };

  const handleKnowledgeChange = (course, text) => {
    setKnowledgePoints(prev => ({ ...prev, [course]: text }));
  };

  const handleFileUpload = (e) => {
    e.preventDefault();
    let files = [];
    if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      files = Array.from(e.dataTransfer.files);
    } else if (e.target.files && e.target.files.length > 0) {
      files = Array.from(e.target.files);
    }
    if (files.length > 0) {
      setSelectedFiles(prev => [...prev, ...files].slice(0, 5));
    }
  };

  const removeFile = (indexToRemove) => {
    setSelectedFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleStartParsing = () => {
    if (selectedFiles.length === 0) return;
    setPrepPhase('parsing'); 
    setTimeout(() => setPrepPhase('outline'), 5000);
  };

  const renderTags = (mode, currentCourse) => {
    if (mode === '备课') {
      const isTargetCourse = currentCourse === '第一章第4-6节 误差的表示和消除' || currentCourse === '第四章第1-5节 频率与相位的测量';
      const szCount = (isTargetCourse && ideologicalState[currentCourse]?.isCompletedOnce) ? 1 : 0;
      
      let caseCount = 0;
      if (isTargetCourse && caseGenerationState[currentCourse]) {
        if (caseGenerationState[currentCourse].project) caseCount++;
        if (caseGenerationState[currentCourse].circuit) caseCount++;
      }
      return ( 
        <div className="flex gap-2 mt-4">
          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100">思政{szCount}个</span>
          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100">案例{caseCount}个</span>
        </div> 
      );
    }
    if (mode === '上课') return ( <div className="flex gap-2 mt-4"><span className="text-xs font-medium text-teal-600 bg-teal-50 px-2 py-1 rounded border border-teal-100">已生成2个案例</span></div> );
    if (mode === '课后') {
      const isHwAssigned = homeworkState && homeworkState[currentCourse];
      const isEvaluated = evaluationState && evaluationState[currentCourse];
      // 根据课程名称生成固定的 78-96 之间的随机百分比
      const hash = currentCourse.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const percent = 78 + (hash % 19);

      return ( 
        <div className="flex gap-2 mt-4">
          <span className={`text-xs px-2.5 py-1 rounded border flex items-center ${isHwAssigned ? 'font-bold text-white bg-emerald-500 border-emerald-600 shadow-sm' : 'font-bold text-amber-700 bg-amber-100 border-amber-300'}`}>
            {isHwAssigned ? '✔ 已布置作业' : '待布置作业'}
          </span>
          <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded border border-indigo-100 flex items-center">
            综合评价指标 {isEvaluated ? `${percent}%` : '--'}
          </span>
        </div> 
      );
    }
    return null;
  };

  const reqModules = selectedCourseTemp === '第一章第4-6节 误差的表示和消除' 
    ? ['智能工厂配电系统故障诊断', '电压表出厂校验闯关']
    : selectedCourseTemp === '第四章第1-5节 频率与相位的测量'
      ? ['微分型频率表原理演示', '相序与相位差测定']
      : [];
      
  const isBothCompleted = reqModules.length > 0 && reqModules.every(m => completedModules.includes(m));

  return (
    <div className={`min-h-[calc(100vh-64px)] bg-slate-50 py-10 transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center text-sm text-slate-500 mb-8 cursor-pointer">
          <span className="hover:text-slate-800 transition-colors" onClick={() => navigateTo('home')}>首页</span>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="font-medium text-slate-800">{title}模式</span>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden min-h-[600px] flex flex-col relative">
          <div className={`${colorClass} px-10 py-10 text-white`}>
            <div className="flex items-center space-x-4 mb-3">
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm"><Icon className="w-8 h-8 text-white" /></div>
              <h1 className="text-3xl font-bold">{title}控制台</h1>
            </div>
            <p className="text-white/80 max-w-2xl text-lg">欢迎进入{title}环境。在这里，Cognis AI Agent 将协助您完成核心任务。</p>
          </div>

          <div className="flex-grow p-8 bg-slate-50/50">
            {prepPhase === 'knowledgeList' && (
              <div className="animate-in fade-in duration-500">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-slate-800 flex items-center">
                    <BookOpen className="w-5 h-5 mr-2 text-blue-500" /> 课程知识点列表
                  </h3>
                  {title === '备课' && (
                    <button onClick={() => setPrepPhase('upload')} className="flex items-center px-4 py-2 bg-white border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 rounded-lg text-sm font-medium transition-all shadow-sm">
                      <RefreshCw className="w-4 h-4 mr-2" /> 重新导入/重新生成
                    </button>
                  )}
                </div>
                <div className="space-y-3">
                  {knowledgePointMockData.map((point, idx) => {
                    const isExpanded = expandedKnowledgePoint === idx;
                    return (
                      <div key={idx} className={`border rounded-2xl bg-white overflow-hidden transition-all hover:border-blue-300 hover:shadow-sm ${isExpanded ? 'border-blue-300 shadow-md ring-1 ring-blue-50' : 'border-slate-200'}`}>
                        <div onClick={() => setExpandedKnowledgePoint(isExpanded ? null : idx)} className="p-5 flex justify-between items-center cursor-pointer hover:bg-slate-50 transition-colors">
                          <div className="flex items-center space-x-4 min-w-0">
                            <span className="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full whitespace-nowrap">{point.chapter}</span>
                            <span className="font-semibold text-slate-700 text-base truncate">{point.name}</span>
                          </div>
                          <ChevronDown className={`w-5 h-5 flex-shrink-0 ml-3 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-blue-500' : 'text-slate-400'}`} />
                        </div>
                        {isExpanded && (
                          <div className="p-6 border-t border-blue-100 bg-blue-50/20 animate-in fade-in slide-in-from-top-2 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="bg-white rounded-xl p-4 border border-slate-100">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">教学目标</p>
                                <p className="text-sm text-slate-700 leading-relaxed">{point.objective}</p>
                              </div>
                              <div className="bg-white rounded-xl p-4 border border-slate-100">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">重点难点</p>
                                <p className="text-sm text-slate-700 leading-relaxed">{point.keyPoints}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {prepPhase === 'upload' && (
              <div className="h-full flex flex-col items-center justify-center min-h-[400px] animate-in fade-in duration-500 py-6">
                <label className={`border-2 border-dashed border-blue-300 bg-blue-50/50 rounded-3xl p-12 w-full max-w-2xl text-center transition-colors flex flex-col items-center shadow-sm ${selectedFiles.length >= 5 ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:bg-blue-100'}`} onDragOver={(e) => e.preventDefault()} onDrop={selectedFiles.length >= 5 ? (e) => e.preventDefault() : handleFileUpload}>
                   <input type="file" className="hidden" accept=".doc,.docx,.pdf,.xls,.xlsx" multiple onChange={handleFileUpload} disabled={selectedFiles.length >= 5} />
                   <UploadCloud className="w-16 h-16 text-blue-400 mb-6" />
                   <h3 className="text-2xl font-bold text-slate-700 mb-3">请导入教案和教学进度计划表</h3>
                   <p className="text-slate-500 text-lg">点击此处选择文件，或将文档拖拽至此区域 (最多上传 5 个)</p>
                </label>

                {selectedFiles.length > 0 && (
                  <div className="mt-8 w-full max-w-2xl flex flex-col items-center space-y-4 animate-in slide-in-from-bottom-4 duration-500">
                    <div className="w-full space-y-3">
                      {selectedFiles.map((file, idx) => (
                        <div key={idx} className="flex justify-between items-center w-full bg-white px-5 py-3.5 rounded-xl border border-slate-200 shadow-sm group">
                          <div className="flex items-center overflow-hidden">
                            <FileText className="w-6 h-6 text-blue-500 mr-4 flex-shrink-0" />
                            <span className="text-slate-700 font-medium truncate max-w-[450px]">{file.name}</span>
                          </div>
                          <button onClick={(e) => { e.preventDefault(); removeFile(idx); }} className="text-slate-300 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors flex-shrink-0" title="移除文件"><X className="w-5 h-5" /></button>
                        </div>
                      ))}
                    </div>
                    <button onClick={handleStartParsing} className="mt-6 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-10 py-4 rounded-xl font-bold transition-all shadow-lg transform hover:-translate-y-0.5 flex items-center text-lg w-full max-w-md justify-center">
                      <BrainCircuit className="w-6 h-6 mr-2" /> 开始 AI 智能解析 ({selectedFiles.length})
                    </button>
                  </div>
                )}
              </div>
            )}

            {prepPhase === 'parsing' && (
              <div className="h-full flex flex-col items-center justify-center min-h-[400px] text-blue-600 animate-in fade-in duration-500">
                 <div className="relative mb-8 mt-8">
                   <div className="absolute inset-0 bg-blue-400 rounded-full blur-xl opacity-20 animate-pulse"></div>
                   <BrainCircuit className="w-24 h-24 relative z-10 animate-bounce text-blue-500" />
                 </div>
                 <h3 className="text-2xl font-bold text-slate-800 mb-4">AI 正在解析文档...</h3>
                 <p className="text-slate-500 text-lg">正在智能提取章节结构与核心知识点，预计需要 5 秒钟</p>
              </div>
            )}

            {prepPhase === 'outline' && (
              <div className="max-w-5xl mx-auto animate-in fade-in duration-500 pb-10">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-slate-800 flex items-center">
                    <BookOpen className="w-6 h-6 mr-3 text-blue-500" /> AI 解析的课程大纲树
                  </h3>
                  <button onClick={() => setPrepPhase('building')} className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-md transform hover:-translate-y-0.5 flex items-center text-base">
                    <CheckCircle2 className="w-5 h-5 mr-2" /> 确认建立课程
                  </button>
                </div>
                <div className="space-y-4 max-h-[550px] overflow-y-auto pr-2 custom-scrollbar">
                   {courseList.map((course, idx) => {
                      const isExpanded = expandedCourseOutline === course;
                      return (
                        <div key={idx} className={`border rounded-2xl bg-white overflow-hidden transition-all hover:border-blue-300 hover:shadow-sm ${isExpanded ? 'border-blue-300 shadow-md ring-1 ring-blue-50' : 'border-slate-200'}`}>
                          <div onClick={() => setExpandedCourseOutline(isExpanded ? null : course)} className="p-5 flex justify-between items-center cursor-pointer hover:bg-slate-50 text-slate-700">
                             <span className="font-semibold text-lg">{course}</span>
                             <div className="flex items-center space-x-4">
                               <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full"><CheckCircle2 className="w-3.5 h-3.5 mr-1" /> 解析成功</span>
                               <ChevronDown className={`w-6 h-6 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-blue-500' : 'text-slate-400'}`} />
                             </div>
                          </div>
                          {isExpanded && (
                            <div className="p-6 border-t border-blue-100 bg-blue-50/30 animate-in fade-in slide-in-from-top-2">
                              <p className="text-base text-slate-700 font-bold mb-3 flex items-center"><Sparkles className="w-5 h-5 mr-2 text-yellow-500" /> 解析出的知识点 (支持人工修改校验)：</p>
                              <textarea value={knowledgePoints[course] || '该章节基础知识点、核心概念及实践应用要点...'} onChange={(e) => handleKnowledgeChange(course, e.target.value)} className="w-full h-36 p-4 text-base border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 resize-none shadow-inner bg-white leading-relaxed"></textarea>
                            </div>
                          )}
                        </div>
                      )
                   })}
                </div>
              </div>
            )}

            {prepPhase === 'building' && (
              <div className="h-full flex flex-col items-center justify-center min-h-[400px] text-teal-600 animate-in fade-in zoom-in duration-500">
                 <div className="relative mb-8 mt-8">
                   <div className="absolute inset-0 bg-teal-400 rounded-full blur-xl opacity-20 animate-pulse"></div>
                   <Loader2 className="w-24 h-24 relative z-10 animate-spin text-teal-500" />
                 </div>
                 <h3 className="text-2xl font-bold text-slate-800 mb-4">AI 正在为您生成专属教学模块...</h3>
                 <p className="text-slate-500 text-lg">正在分配教案框架与智能备课卡片，即将完成</p>
              </div>
            )}

            {prepPhase === 'grid' && (
              <div className="animate-in fade-in duration-500">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-slate-800 flex items-center">
                    <BookOpen className="w-5 h-5 mr-2 text-slate-500" /> 请选择课程模块
                  </h3>
                  {title === '备课' && (
                    <button onClick={() => { if (setIsCourseBuilt) setIsCourseBuilt(false); setSelectedFiles([]); setPrepPhase('upload'); }} className="flex items-center px-4 py-2 bg-white border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 rounded-lg text-sm font-medium transition-all shadow-sm">
                      <UploadCloud className="w-4 h-4 mr-2" /> 重新导入教案
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {courseList.map((course, idx) => {
                    return (
                      <div key={idx} onClick={() => handleCourseClick(course)} className="p-4 rounded-xl border bg-white text-slate-700 flex flex-col justify-between min-h-[110px] transition-all duration-300 border-slate-200 hover:border-teal-400 hover:shadow-md cursor-pointer hover:-translate-y-1">
                        <div className="text-sm font-medium leading-relaxed">{course}</div>
                        {renderTags(title, course)}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {showModal && selectedCourseTemp && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm transition-opacity">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200 m-4">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                  <h4 className="font-bold text-slate-800 text-lg">选择后续操作</h4>
                  <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-md hover:bg-slate-200 transition-colors"><X className="w-5 h-5" /></button>
                </div>
                
                <div className="p-6">
                  <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                    当前课程：<span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">{selectedCourseTemp}</span>
                    <br/>请选择要进入的{title}环节：
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {getModalOptions(title, selectedCourseTemp).length === 0 ? (
                      <div className="col-span-1 sm:col-span-2 p-6 text-center text-slate-400 bg-slate-50 rounded-xl border border-slate-200 border-dashed text-sm">
                        该章节暂未分配互动实训模块，请先在备课台进行生成
                      </div>
                    ) : (
                      getModalOptions(title, selectedCourseTemp).map((opt, idx) => {
                        const OptIcon = opt.icon;
                        let isModuleCompleted = false;
                        if (title === '备课') {
                           if (opt.label === '思政导入') isModuleCompleted = ideologicalState[selectedCourseTemp]?.isCompletedOnce;
                        } else if (title === '课后') {
                           if (opt.label === '布置作业') isModuleCompleted = homeworkState && homeworkState[selectedCourseTemp];
                           else isModuleCompleted = completedModules.includes(opt.label);
                        } else {
                           isModuleCompleted = completedModules.includes(opt.label);
                        }
                        
                        return (
                          <div key={idx} onClick={() => { setShowModal(false); setActiveCourse(selectedCourseTemp); navigateTo(opt.path); }} className={`relative border border-slate-200 rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer transition-all text-slate-700 group ${isModuleCompleted ? 'bg-slate-50 border-slate-300' : 'hover:bg-teal-50 hover:border-teal-400 hover:text-teal-700 hover:shadow-sm'}`}>
                            <OptIcon className={`w-8 h-8 mb-3 transition-colors ${isModuleCompleted ? 'text-teal-600' : 'text-slate-400 group-hover:text-teal-500'}`} />
                            <span className={`font-semibold text-[15px] text-center leading-tight ${isModuleCompleted ? 'text-slate-900' : ''}`}>{opt.label}</span>
                            {isModuleCompleted && (
                              <div className="absolute top-2 right-2 text-teal-500 bg-white shadow-sm rounded-full p-0.5"><CheckCircle className="w-4 h-4" /></div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>

                  {title === '上课' && (
                    <div className="mt-6 pt-6 border-t border-slate-100">
                      <button disabled={!isBothCompleted} onClick={() => { setShowModal(false); setActiveCourse(selectedCourseTemp); navigateTo('上课-课堂评价'); }} className={`w-full py-4 rounded-xl flex items-center justify-center font-bold transition-all ${isBothCompleted ? 'bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white shadow-lg transform hover:-translate-y-0.5 cursor-pointer' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}>
                        {!isBothCompleted && <Lock className="w-5 h-5 mr-2 opacity-60" />}
                        {isBothCompleted && <BarChart3 className="w-5 h-5 mr-2" />}
                        课堂评价 {isBothCompleted ? '' : '(请先完成上方两个实训以解锁)'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ActionDetailView = ({ pageKey, activeCourse, isAnimating, navigateTo, ideologicalState, updateIdeologicalState, caseGenerationState, updateCaseGenerationState, homeworkState, updateHomeworkState, updateEvaluationState }) => {
  const [parentMode, actionName] = pageKey.split('-');
  
  let parentInfo = { icon: BookOpen, colorClass: 'bg-gradient-to-r from-blue-600 to-blue-500' };
  if (parentMode === '上课') parentInfo = { icon: MonitorPlay, colorClass: 'bg-gradient-to-r from-teal-600 to-teal-500' };
  if (parentMode === '课后') parentInfo = { icon: ClipboardCheck, colorClass: 'bg-gradient-to-r from-indigo-600 to-indigo-500' };
  const ParentIcon = parentInfo.icon;

  let iframeContent = null;
  if (actionName === '智能工厂配电系统故障诊断') iframeContent = ghostTrippingHTML;
  else if (actionName === '电压表出厂校验闯关') iframeContent = voltmeterSimHTML;
  else if (actionName === '微分型频率表原理演示') iframeContent = frequencyMeterHTMLTemplate.replace(/PAGE_TITLE/g, '微分型频率表原理演示').replace(/MODULE_NAME/g, '微分型频率表原理演示');
  else if (actionName === '相序与相位差测定') iframeContent = getPlaceholderHTML('相序与相位差测定');

  useEffect(() => {
    if (actionName === '评价结果' && updateEvaluationState) {
      updateEvaluationState(activeCourse, true);
    }
  }, [actionName, activeCourse, updateEvaluationState]);

  return (
    <div className={`min-h-[calc(100vh-64px)] bg-slate-50 py-10 transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center text-sm text-slate-500 mb-8 cursor-pointer">
          <span className="hover:text-slate-800 transition-colors" onClick={() => navigateTo('home')}>首页</span>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="hover:text-slate-800 transition-colors" onClick={() => navigateTo(parentMode)}>{parentMode}模式</span>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="font-medium text-slate-800">{actionName}</span>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden min-h-[600px] flex flex-col">
          <div className={`${parentInfo.colorClass} px-10 py-8 text-white flex items-center justify-between`}>
            <div className="flex items-center space-x-5">
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm"><ParentIcon className="w-7 h-7 text-white" /></div>
              <div>
                <h1 className="text-2xl font-bold">{actionName}</h1>
                <p className="text-white/80 text-sm mt-1.5 flex items-center"><span className="bg-white/20 px-2 py-0.5 rounded mr-2 text-xs">当前课程</span>{activeCourse}</p>
              </div>
            </div>
            <button onClick={() => navigateTo(parentMode)} className="px-5 py-2.5 bg-white/20 hover:bg-white/30 rounded-xl backdrop-blur-sm transition-colors text-sm font-semibold flex items-center">
              <ArrowRight className="w-4 h-4 mr-2 rotate-180" /> 返回上一级
            </button>
          </div>
          
          <div className={`flex-grow flex flex-col text-slate-400 bg-slate-50/50 ${iframeContent ? 'p-0 overflow-hidden' : 'p-6 items-center justify-center'}`}>
            {iframeContent ? (
              <iframe srcDoc={iframeContent} className="w-full h-full min-h-[850px] border-none" title={actionName} sandbox="allow-scripts allow-same-origin" />
            ) : actionName === '评价结果' ? (
              <div className="w-full h-full flex flex-col">
                <EvaluationReportView activeCourse={activeCourse} />
              </div>
            ) : actionName === '课堂评价' ? (
              <div className="w-full h-full flex flex-col"><ClassroomEvaluationView activeCourse={activeCourse} /></div>
            ) : actionName === '布置作业' ? (
              <div className="w-full h-full flex flex-col">
                <HomeworkAssignmentView 
                  activeCourse={activeCourse} 
                  isAssigned={homeworkState && homeworkState[activeCourse]} 
                  setAssigned={(val) => updateHomeworkState(activeCourse, val)} 
                />
              </div>
            ) : actionName === '思政导入' ? (
              <div className="w-full h-full flex flex-col">
                <IdeologicalImportView activeCourse={activeCourse} ideologicalState={ideologicalState[activeCourse]} setIdeologicalState={(updater) => updateIdeologicalState(activeCourse, updater)} />
              </div>
            ) : actionName === '案例生成' ? (
              <div className="w-full h-full flex flex-col">
                <CaseGenerationView activeCourse={activeCourse} setCaseGenerationState={(updater) => updateCaseGenerationState(activeCourse, updater)} />
              </div>
            ) : (
              <div className="w-full h-full flex flex-col"><AIGeneratorView actionName={actionName} courseName={activeCourse} /></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [activeCourse, setActiveCourse] = useState('第一章第4-6节 误差的表示和消除');
  const [isAnimating, setIsAnimating] = useState(false);
  const [completedModules, setCompletedModules] = useState([]);
  const [isCourseBuilt, setIsCourseBuilt] = useState(false);

  // 为每个课程维持独立的全局状态记忆
  const [ideologicalState, setIdeologicalState] = useState({
    "第一章第4-6节 误差的表示和消除": { step: 1, topic: '', knowledge: '测量误差', selectedRelations: [], isCompletedOnce: false },
    "第四章第1-5节 频率与相位的测量": { step: 1, topic: '', knowledge: '频率与相位', selectedRelations: [], isCompletedOnce: false }
  });

  const [caseGenerationState, setCaseGenerationState] = useState({
    "第一章第4-6节 误差的表示和消除": { project: false, circuit: false },
    "第四章第1-5节 频率与相位的测量": { project: false, circuit: false }
  });

  const [homeworkState, setHomeworkState] = useState({
    "第一章第4-6节 误差的表示和消除": false,
    "第四章第1-5节 频率与相位的测量": false
  });

  const [evaluationState, setEvaluationState] = useState({
    "第一章第4-6节 误差的表示和消除": false,
    "第四章第1-5节 频率与相位的测量": false
  });

  const updateIdeologicalState = (course, updater) => {
    setIdeologicalState(prev => ({ ...prev, [course]: typeof updater === 'function' ? updater(prev[course]) : updater }));
  };

  const updateCaseGenerationState = (course, updater) => {
    setCaseGenerationState(prev => ({ ...prev, [course]: typeof updater === 'function' ? updater(prev[course]) : updater }));
  };

  const updateHomeworkState = (course, val) => {
    setHomeworkState(prev => ({ ...prev, [course]: val }));
  };

  const updateEvaluationState = (course, val) => {
    setEvaluationState(prev => ({ ...prev, [course]: val }));
  };

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data && event.data.type === 'MODULE_COMPLETED') {
        const moduleName = event.data.module;
        setCompletedModules(prev => {
          if (!prev.includes(moduleName)) return [...prev, moduleName];
          return prev;
        });
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const navigateTo = (page) => {
    if (page === activePage) return;
    setIsAnimating(true);
    setTimeout(() => {
      setActivePage(page);
      setIsAnimating(false);
    }, 300);
  };

  return (
    <div className="min-h-screen font-sans bg-slate-50 text-slate-900 selection:bg-teal-200 selection:text-teal-900">
      <Navbar navigateTo={navigateTo} />
      <main>
        {activePage === 'home' && <HomeView isAnimating={isAnimating} navigateTo={navigateTo} />}
        {activePage === '备课' && <SubPageView title="备课" icon={BookOpen} colorClass="bg-gradient-to-r from-blue-600 to-blue-500" isAnimating={isAnimating} navigateTo={navigateTo} completedModules={completedModules} isCourseBuilt={isCourseBuilt} setIsCourseBuilt={setIsCourseBuilt} ideologicalState={ideologicalState} caseGenerationState={caseGenerationState} activeCourse={activeCourse} setActiveCourse={setActiveCourse} homeworkState={homeworkState} evaluationState={evaluationState} />}
        {activePage === '上课' && <SubPageView title="上课" icon={MonitorPlay} colorClass="bg-gradient-to-r from-teal-600 to-teal-500" isAnimating={isAnimating} navigateTo={navigateTo} completedModules={completedModules} isCourseBuilt={isCourseBuilt} setIsCourseBuilt={setIsCourseBuilt} ideologicalState={ideologicalState} caseGenerationState={caseGenerationState} activeCourse={activeCourse} setActiveCourse={setActiveCourse} homeworkState={homeworkState} evaluationState={evaluationState} />}
        {activePage === '课后' && <SubPageView title="课后" icon={ClipboardCheck} colorClass="bg-gradient-to-r from-indigo-600 to-indigo-500" isAnimating={isAnimating} navigateTo={navigateTo} completedModules={completedModules} isCourseBuilt={isCourseBuilt} setIsCourseBuilt={setIsCourseBuilt} ideologicalState={ideologicalState} caseGenerationState={caseGenerationState} activeCourse={activeCourse} setActiveCourse={setActiveCourse} homeworkState={homeworkState} evaluationState={evaluationState} />}
        {activePage.includes('-') && <ActionDetailView pageKey={activePage} activeCourse={activeCourse} isAnimating={isAnimating} navigateTo={navigateTo} ideologicalState={ideologicalState} updateIdeologicalState={updateIdeologicalState} caseGenerationState={caseGenerationState} updateCaseGenerationState={updateCaseGenerationState} homeworkState={homeworkState} updateHomeworkState={updateHomeworkState} updateEvaluationState={updateEvaluationState} />}
      </main>
      <footer className="bg-white border-t border-slate-200 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-500 text-sm">
          &copy; 2024 Cognis AI Agent. All rights reserved.
        </div>
      </footer>
    </div>
  );
}