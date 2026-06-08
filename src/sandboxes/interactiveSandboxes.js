// --- 动态生成占位 HTML ---
export const getPlaceholderHTML = (moduleName) => `<!DOCTYPE html>
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

// 1. 第一章第1-3节：电工测量方法排障项目案例
export const basicMeasurementTroubleshootingHTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>电工测量方法排障实训 - AI 助教递进式诊断</title>
    <style>
        :root {
            --bg: #f8fafc; --panel: #ffffff; --ink: #1e293b; --muted: #64748b;
            --line: #dbe4ef; --blue: #2563eb; --teal: #0f766e; --amber: #d97706;
            --green: #16a34a; --red: #dc2626;
        }
        * { box-sizing: border-box; }
        body { margin: 0; min-height: 100vh; background: var(--bg); color: var(--ink); font-family: "Segoe UI", "PingFang SC", sans-serif; }
        .shell { max-width: 1180px; margin: 0 auto; padding: 28px; }
        .hero { background: linear-gradient(135deg, #1d4ed8, #0f766e); color: white; border-radius: 18px; padding: 26px 30px; box-shadow: 0 18px 45px rgba(37, 99, 235, 0.18); }
        .hero h1 { margin: 0 0 10px; font-size: 26px; }
        .hero p { margin: 0; color: rgba(255,255,255,.85); line-height: 1.7; }
        .layout { display: grid; grid-template-columns: 1.05fr .95fr; gap: 22px; margin-top: 22px; align-items: stretch; }
        .card { background: var(--panel); border: 1px solid var(--line); border-radius: 16px; box-shadow: 0 10px 30px rgba(15, 23, 42, .06); overflow: hidden; }
        .card-header { padding: 18px 20px; border-bottom: 1px solid var(--line); display: flex; justify-content: space-between; align-items: center; gap: 12px; }
        .card-header h2 { font-size: 18px; margin: 0; }
        .tag { font-size: 12px; color: var(--blue); background: #eff6ff; border: 1px solid #bfdbfe; padding: 4px 8px; border-radius: 999px; font-weight: 700; white-space: nowrap; }
        .scene { padding: 20px; display: grid; gap: 16px; }
        .diagram { border: 1px solid #cbd5e1; border-radius: 14px; background: linear-gradient(180deg, #f8fafc, #eef6ff); padding: 20px; min-height: 260px; position: relative; }
        .bus { height: 10px; background: #334155; border-radius: 99px; margin: 34px 28px 22px; position: relative; }
        .node { position: absolute; top: -18px; width: 46px; height: 46px; border-radius: 999px; background: white; border: 3px solid #38bdf8; display: flex; align-items: center; justify-content: center; font-weight: 800; color: #0f172a; box-shadow: 0 8px 18px rgba(2, 132, 199, .18); }
        .n1 { left: 8%; } .n2 { left: 44%; border-color: #f59e0b; } .n3 { right: 8%; border-color: #22c55e; }
        .meter { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 48px; }
        .meter-box { border: 1px solid #dbe4ef; background: white; border-radius: 12px; padding: 14px; }
        .meter-box strong { display: block; font-size: 13px; margin-bottom: 8px; color: #475569; }
        .reading { font-size: 22px; font-weight: 900; color: #0f172a; }
        .bad { color: var(--red); } .warn { color: var(--amber); } .ok { color: var(--green); }
        .log { background: #0f172a; color: #dbeafe; border-radius: 12px; padding: 16px; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12px; line-height: 1.75; }
        .log b { color: #fde68a; }
        .knowledge { display: flex; flex-wrap: wrap; gap: 8px; padding: 0 20px 20px; }
        .knowledge span { background: #f1f5f9; color: #475569; border: 1px solid #e2e8f0; padding: 6px 10px; border-radius: 999px; font-size: 12px; font-weight: 700; }
        .coach { display: flex; flex-direction: column; min-height: 100%; }
        .coach-body { padding: 20px; flex: 1; display: flex; flex-direction: column; gap: 16px; }
        .progress { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
        .dot { height: 8px; border-radius: 999px; background: #e2e8f0; }
        .dot.active { background: var(--blue); }
        .call-ai { width: 100%; background: #0f172a; color: white; display: flex; justify-content: center; align-items: center; gap: 8px; }
        .call-ai:hover { background: #1e293b; }
        .ai-box { border-left: 4px solid var(--blue); background: #eff6ff; border-radius: 0 12px 12px 0; padding: 16px; line-height: 1.7; color: #1e3a8a; }
        .stage-title { margin: 0; font-size: 20px; color: #0f172a; }
        .options { display: grid; gap: 10px; }
        .option { width: 100%; text-align: left; border: 2px solid #e2e8f0; background: white; border-radius: 12px; padding: 14px 15px; cursor: pointer; color: #334155; font-size: 15px; line-height: 1.55; transition: .18s; }
        .option:hover { border-color: #93c5fd; background: #f8fbff; }
        .option.correct { border-color: var(--green); background: #ecfdf5; color: #166534; font-weight: 800; }
        .option.wrong { border-color: var(--red); background: #fef2f2; color: #991b1b; }
        .option:disabled { cursor: not-allowed; opacity: .75; }
        .actions { display: flex; justify-content: space-between; gap: 12px; margin-top: auto; }
        .btn { border: 0; border-radius: 11px; padding: 12px 16px; cursor: pointer; font-weight: 800; transition: .18s; }
        .btn-primary { background: var(--blue); color: white; }
        .btn-primary:hover { background: #1d4ed8; }
        .btn-secondary { background: #f1f5f9; color: #475569; }
        .btn-secondary:hover { background: #e2e8f0; }
        .btn:disabled { opacity: .45; cursor: not-allowed; }
        .feedback { min-height: 48px; padding: 12px 14px; border-radius: 12px; background: #f8fafc; color: var(--muted); border: 1px dashed #cbd5e1; line-height: 1.6; }
        .complete { background: #ecfdf5; border-color: #bbf7d0; color: #166534; font-weight: 800; }
        @media (max-width: 900px) { .layout { grid-template-columns: 1fr; } .meter { grid-template-columns: 1fr; } }
    </style>
</head>
<body>
    <div class="shell">
        <section class="hero">
            <h1>智能产线测量异常排障：仪表基础与测量方法选择</h1>
            <p>背景：某柔性装配线的 24V 传感器供电回路频繁误报欠压，学生需要调用 AI 助教，从测量对象、仪表类型、测量方法与测量系统组成四个层面逐步定位问题。</p>
        </section>

        <main class="layout">
            <section class="card">
                <div class="card-header">
                    <h2>现场图文场景</h2>
                    <span class="tag">知识点：测量方法 / 仪表分类 / 测量系统</span>
                </div>
                <div class="scene">
                    <div class="diagram">
                        <div class="bus">
                            <div class="node n1">PLC</div>
                            <div class="node n2">S2</div>
                            <div class="node n3">LOAD</div>
                        </div>
                        <div class="meter">
                            <div class="meter-box"><strong>万用表直接测量</strong><div class="reading bad">18.6 V</div></div>
                            <div class="meter-box"><strong>标准源比较测量</strong><div class="reading ok">24.1 V</div></div>
                            <div class="meter-box"><strong>回路工作电流</strong><div class="reading warn">0.42 A</div></div>
                        </div>
                    </div>
                    <div class="log">
                        [09:20:11] WARN  S2 sensor undervoltage alarm<br>
                        [09:20:14] INFO  PLC input status normal<br>
                        [09:20:21] <b>NOTE</b> handheld meter probe connected across load while line is energized<br>
                        [09:20:30] CHECK standard source output: 24.1V stable<br>
                        [09:21:02] TODO  verify method, meter category, and measurement chain
                    </div>
                </div>
                <div class="knowledge">
                    <span>电工测量的基本概念</span>
                    <span>电工仪表的分类</span>
                    <span>直接测量 / 比较测量</span>
                    <span>测量系统分析</span>
                </div>
            </section>

            <section class="card coach">
                <div class="card-header">
                    <h2>AI 助教递进式排障</h2>
                    <span class="tag" id="stageLabel">第 1 / 4 问</span>
                </div>
                <div class="coach-body">
                    <div class="progress" id="progress"></div>
                    <button class="btn call-ai" id="callAiBtn">一键呼叫 AI 助教</button>
                    <h3 class="stage-title" id="stageTitle"></h3>
                    <div class="ai-box" id="aiPrompt"></div>
                    <div class="options" id="options"></div>
                    <div class="feedback" id="feedback">点击选项后，AI 助教会给出下一步排障提示。</div>
                    <div class="actions">
                        <button class="btn btn-secondary" id="resetBtn">重新排障</button>
                        <button class="btn btn-primary" id="nextBtn" disabled>下一问</button>
                    </div>
                </div>
            </section>
        </main>
    </div>

    <script>
        const moduleName = '电工测量方法排障实训';
        const stages = [
            {
                title: '第一问：先确认测量对象',
                prompt: 'AI 助教：现场同时出现万用表读数偏低、PLC 输入正常、标准源输出稳定。第一步应该先确认什么，才能避免盲目换设备？',
                options: [
                    '直接更换传感器 S2，因为报警一定来自传感器损坏。',
                    '确认测量对象和被测量：到底是在测电源端电压、负载端电压，还是回路压降。',
                    '把万用表量程调到最大，读数自然会更稳定。'
                ],
                answer: 1,
                feedback: '正确。电工测量首先要明确被测对象和被测量，否则同样是“电压”，测点不同就可能得到完全不同的工程含义。'
            },
            {
                title: '第二问：选择合适测量方法',
                prompt: 'AI 助教：直接用手持表测得 18.6V，但标准源比较测量显示 24.1V。为了验证手持表读数是否可信，下一步最合适的方法是什么？',
                options: [
                    '采用比较测量：用标准源或已知准确度仪表对手持表读数进行校验。',
                    '继续直接测量 10 次，取平均值即可消除所有系统误差。',
                    '只看 PLC 是否报警，不再需要物理测量。'
                ],
                answer: 0,
                feedback: '正确。直接测量适合快速判断，比较测量适合校准与溯源，可以帮助区分真实电压异常与仪表/接线引入的误差。'
            },
            {
                title: '第三问：判断仪表类型与接入影响',
                prompt: 'AI 助教：手持表跨接在负载两端时，回路电流和接触状态发生波动。这里最需要关注哪个仪表特性？',
                options: [
                    '外壳颜色，因为不同颜色代表不同精度。',
                    '仪表输入阻抗、准确度等级和接入方式对被测电路的影响。',
                    '显示屏刷新率，刷新越快读数越真实。'
                ],
                answer: 1,
                feedback: '正确。仪表不是“透明观察者”，它接入电路后可能改变被测对象状态。选择仪表时要关注输入阻抗、准确度等级、量程和接入方式。'
            },
            {
                title: '第四问：形成完整测量系统诊断',
                prompt: 'AI 助教：现在你要给出最终处置建议。哪一个结论最符合“测量系统分析”的思路？',
                options: [
                    '只记录最低读数 18.6V，并判定供电系统失效。',
                    '把传感器、导线、测点、仪表、接线方式和标准源校验串成测量链，定位异常来自测点接触和直接测量方式不当。',
                    '忽略标准源和 PLC 信息，只凭手持表读数写报告。'
                ],
                answer: 1,
                feedback: '完整。你把测量对象、测量方法、仪表特性和测量系统组成串联起来，完成了从读数异常到工程诊断的闭环。'
            }
        ];

        let currentStage = 0;
        let answered = false;
        let assistantCalled = false;

        function render() {
            const stage = stages[currentStage];
            answered = false;
            document.getElementById('progress').innerHTML = stages.map((_, index) => '<div class="dot ' + (assistantCalled && index <= currentStage ? 'active' : '') + '"></div>').join('');
            if (!assistantCalled) {
                document.getElementById('stageLabel').innerText = '待开始';
                document.getElementById('stageTitle').innerText = '现场异常已加载';
                document.getElementById('aiPrompt').innerText = '点击“一键呼叫 AI 助教”，系统会把这个项目案例拆成 4 个递进排障问题，引导学生从测量对象一路分析到测量系统。';
                document.getElementById('options').innerHTML = '';
                document.getElementById('feedback').className = 'feedback';
                document.getElementById('feedback').innerText = '等待学生呼叫 AI 助教。';
                document.getElementById('nextBtn').disabled = true;
                document.getElementById('nextBtn').innerText = '下一问';
                document.getElementById('callAiBtn').disabled = false;
                document.getElementById('callAiBtn').innerText = '一键呼叫 AI 助教';
                return;
            }
            document.getElementById('stageLabel').innerText = '第 ' + (currentStage + 1) + ' / ' + stages.length + ' 问';
            document.getElementById('stageTitle').innerText = stage.title;
            document.getElementById('aiPrompt').innerText = stage.prompt;
            document.getElementById('feedback').className = 'feedback';
            document.getElementById('feedback').innerText = '点击选项后，AI 助教会给出下一步排障提示。';
            document.getElementById('nextBtn').disabled = true;
            document.getElementById('nextBtn').innerText = currentStage === stages.length - 1 ? '完成实训' : '下一问';
            document.getElementById('callAiBtn').disabled = true;
            document.getElementById('callAiBtn').innerText = 'AI 助教已接入';
            document.getElementById('options').innerHTML = stage.options.map((option, index) =>
                '<button class="option" data-index="' + index + '">' + option + '</button>'
            ).join('');
            Array.from(document.querySelectorAll('.option')).forEach(btn => {
                btn.addEventListener('click', () => choose(Number(btn.dataset.index)));
            });
        }

        function choose(index) {
            if (answered) return;
            answered = true;
            const stage = stages[currentStage];
            Array.from(document.querySelectorAll('.option')).forEach((btn, i) => {
                btn.disabled = true;
                if (i === stage.answer) btn.classList.add('correct');
                if (i === index && i !== stage.answer) btn.classList.add('wrong');
            });
            const feedback = document.getElementById('feedback');
            feedback.innerText = index === stage.answer ? stage.feedback : '这一步还不够稳。AI 助教提示：正确路径是先控制变量，再用测量方法和仪表特性去验证读数来源。' + ' ' + stage.feedback;
            document.getElementById('nextBtn').disabled = false;
        }

        document.getElementById('nextBtn').addEventListener('click', () => {
            if (currentStage < stages.length - 1) {
                currentStage += 1;
                render();
            } else {
                const feedback = document.getElementById('feedback');
                feedback.className = 'feedback complete';
                feedback.innerText = '实训完成：已记录“电工测量方法排障实训”。你已经掌握从测量对象到测量系统的递进排障链路。';
                document.getElementById('nextBtn').disabled = true;
                if (window.parent) window.parent.postMessage({ type: 'MODULE_COMPLETED', module: moduleName }, '*');
            }
        });

        document.getElementById('resetBtn').addEventListener('click', () => {
            currentStage = 0;
            assistantCalled = false;
            render();
        });

        document.getElementById('callAiBtn').addEventListener('click', () => {
            assistantCalled = true;
            render();
        });

        render();
    </script>
</body>
</html>`;

// 1. 第一章：配电系统故障诊断沙盘
export const ghostTrippingHTML = `<!DOCTYPE html>
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
export const voltmeterSimHTML = `<!DOCTYPE html>
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
export const frequencyMeterHTMLTemplate = `<!DOCTYPE html>
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
