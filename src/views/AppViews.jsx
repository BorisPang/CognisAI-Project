import React, { useState, useEffect, useMemo } from 'react';
import { BookOpen, MonitorPlay, ClipboardCheck, ArrowRight, BrainCircuit, User, Bell, Search, BarChart3, ChevronRight, X, FileText, CheckCircle, Wrench, FileQuestion, Sparkles, Loader2, Lock, AlertCircle, TrendingUp, Users, Target, CheckCircle2, Clock, FileSpreadsheet, ChevronDown, ChevronUp, UploadCloud, RefreshCw, CheckSquare, Presentation, Lightbulb, ArrowDownToLine, Layers, Settings2, Send, MessageSquare, Activity } from 'lucide-react';
import { courseList, knowledgeModules, knowledgePointMockData, radarDimensions, studentRadarData, teachingGuides } from '../data/courseData';
import { generateWithGemini } from '../services/gemini';
import { basicMeasurementTroubleshootingHTML, dynamometerMultimeterCaseHTML, frequencyMeterHTMLTemplate, galvanometerElectromagneticCaseHTML, getPlaceholderHTML, ghostTrippingHTML, potentiometerElectronicVoltmeterCaseHTML, voltageCurrentMagnetoelectricCaseHTML, voltmeterSimHTML } from '../sandboxes/interactiveSandboxes';

// --- 动态获取弹窗选项 ---
const getModalOptions = (title, course) => {
  if (title === '备课') return [{ label: '思政导入', path: '备课-思政导入', icon: BookOpen }, { label: '案例生成', path: '备课-案例生成', icon: FileText }];
  if (title === '课后') return [{ label: '布置作业', path: '课后-布置作业', icon: FileQuestion }, { label: '评价结果', path: '课后-评价结果', icon: BarChart3 }];
  if (title === '上课') {
    if (course === '第一章第1-3节 电工仪表与测量的基本方法') {
      return [
        { label: '电工测量方法排障实训', path: '上课-电工测量方法排障实训', icon: Wrench }
      ];
    }
    if (course === '第一章第4-6节 误差的表示和消除') {
      return [
        { label: '智能工厂配电系统故障诊断', path: '上课-智能工厂配电系统故障诊断', icon: Wrench }, 
        { label: '电压表出厂校验闯关', path: '上课-电压表出厂校验闯关', icon: CheckCircle }
      ];
    }
    if (course === '第二章第1-2节 电压与电流的测量&磁电系仪表') {
      return [
        { label: '电压电流与磁电系仪表接入排障', path: '上课-电压电流与磁电系仪表接入排障', icon: Wrench }
      ];
    }
    if (course === '第二章第3-4节 磁电系检流计&电磁系仪表') {
      return [
        { label: '检流计零位漂移与电磁系仪表排障', path: '上课-检流计零位漂移与电磁系仪表排障', icon: Wrench }
      ];
    }
    if (course === '第二章第5-7节 电动系仪表&万用电表') {
      return [
        { label: '电动系功率表与万用表量程排障', path: '上课-电动系功率表与万用表量程排障', icon: Wrench }
      ];
    }
    if (course === '第二章第8-10节 直流电位差计&电子系电压表') {
      return [
        { label: '直流电位差计与电子电压表高阻排障', path: '上课-直流电位差计与电子电压表高阻排障', icon: Wrench }
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

const hasGeneratedCase = (courseState) => Boolean(courseState && (courseState.project || courseState.circuit));

const getGeneratedCaseSummaries = (activeCourse, generatedCaseState = {}) => {
  const cases = [];
  if (generatedCaseState.project) {
    const projectTitleMap = {
      '第一章第1-3节 电工仪表与测量的基本方法': '电工测量方法排障实训',
      '第一章第4-6节 误差的表示和消除': '智能工厂配电系统故障诊断',
      '第二章第1-2节 电压与电流的测量&磁电系仪表': '电压电流与磁电系仪表接入排障',
      '第二章第3-4节 磁电系检流计&电磁系仪表': '检流计零位漂移与电磁系仪表排障',
      '第二章第5-7节 电动系仪表&万用电表': '电动系功率表与万用表量程排障',
      '第二章第8-10节 直流电位差计&电子系电压表': '直流电位差计与电子电压表高阻排障',
      '第四章第1-5节 频率与相位的测量': '大型变电站频率异常排查'
    };
    cases.push({
      type: 'project',
      title: projectTitleMap[activeCourse] || `${activeCourse} 项目案例`,
      desc: '面向真实工程情境的交互式项目沙盘，可直接用于上课模式。'
    });
  }
  if (generatedCaseState.circuit) {
    const circuitTitleMap = {
      '第一章第1-3节 电工仪表与测量的基本方法': '电工仪表基础电路模型',
      '第一章第4-6节 误差的表示和消除': '电压表出厂校验闯关',
      '第四章第1-5节 频率与相位的测量': '微分型频率表原理演示'
    };
    cases.push({
      type: 'circuit',
      title: circuitTitleMap[activeCourse] || `${activeCourse} 电路模型`,
      desc: '以电路模型或仪表交互为载体，支持课堂演示和学生操作。'
    });
  }
  return cases;
};

export const Navbar = ({ navigateTo }) => (
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
export const HomeView = ({ isAnimating, navigateTo }) => (
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
const CaseGenerationView = ({ activeCourse, generatedCaseState, setCaseGenerationState }) => {
  const generatedCases = getGeneratedCaseSummaries(activeCourse, generatedCaseState);
  const [step, setStep] = useState(generatedCases.length > 0 ? 0 : 1);
  const [selectedKnowledge, setSelectedKnowledge] = useState([]);
  const [description, setDescription] = useState('');
  const [caseType, setCaseType] = useState('project'); 
  const [complexity, setComplexity] = useState(2); 
  const [selectedMethods, setSelectedMethods] = useState([]);
  const [uploadedFile, setUploadedFile] = useState(null);

  let knowledgePoints;
  if (activeCourse === '第一章第4-6节 误差的表示和消除') {
    knowledgePoints = ['误差的分类', '绝对误差', '相对误差', '引用误差'];
  } else if (activeCourse === '第四章第1-5节 频率与相位的测量') {
    knowledgePoints = ['工频测量', '高低频测量', '电动系频率表', '变换式频率表'];
  } else if (activeCourse === '第一章第1-3节 电工仪表与测量的基本方法') {
    knowledgePoints = ['电工测量的基本概念', '电工仪表的分类', '测量方法', '测量系统分析'];
  } else if (activeCourse === '第二章第1-2节 电压与电流的测量&磁电系仪表') {
    knowledgePoints = ['电压测量原理', '电流测量原理', '磁电系仪表结构', '仪表内阻影响'];
  } else if (activeCourse === '第二章第3-4节 磁电系检流计&电磁系仪表') {
    knowledgePoints = ['检流计灵敏度', '电磁系仪表结构', '交直流测量', '桥式测量应用'];
  } else if (activeCourse === '第二章第5-7节 电动系仪表&万用电表') {
    knowledgePoints = ['电动系仪表原理', '功率测量应用', '万用表结构', '量程选择'];
  } else if (activeCourse === '第二章第8-10节 直流电位差计&电子系电压表') {
    knowledgePoints = ['补偿测量原理', '标准电池', '电子电压表特点', '高阻抗测量'];
  } else {
    knowledgePoints = ['基本测量原理', '仪表结构', '误差分析', '实际应用'];
  }

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
        setCaseGenerationState(prev => ({ ...prev, [caseType]: true }));
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
      } else if (activeCourse === '第一章第1-3节 电工仪表与测量的基本方法') {
          return caseType === 'project'
            ? basicMeasurementTroubleshootingHTML
            : getPlaceholderHTML('电工仪表基础电路模型');
      } else if (activeCourse === '第二章第1-2节 电压与电流的测量&磁电系仪表') {
          return caseType === 'project'
            ? voltageCurrentMagnetoelectricCaseHTML
            : getPlaceholderHTML('磁电系电压表电流表校准');
      } else if (activeCourse === '第二章第3-4节 磁电系检流计&电磁系仪表') {
          return caseType === 'project'
            ? galvanometerElectromagneticCaseHTML
            : getPlaceholderHTML('检流计与电磁系仪表实训');
      } else if (activeCourse === '第二章第5-7节 电动系仪表&万用电表') {
          return caseType === 'project'
            ? dynamometerMultimeterCaseHTML
            : getPlaceholderHTML('电动系仪表与万用表实操');
      } else if (activeCourse === '第二章第8-10节 直流电位差计&电子系电压表') {
          return caseType === 'project'
            ? potentiometerElectronicVoltmeterCaseHTML
            : getPlaceholderHTML('直流电位差计与电子电压表');
      }
      return getPlaceholderHTML(`${activeCourse} 教学案例`);
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex-1 min-h-0 overflow-y-auto pb-12 pr-2 custom-scrollbar">
      {step === 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in duration-500">
          <div className="p-8 border-b border-slate-100 bg-emerald-50/60 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="text-2xl font-bold text-emerald-900 flex items-center mb-2">
                <CheckCircle2 className="w-6 h-6 mr-2 text-emerald-600" /> 已生成教学案例
              </h3>
              <p className="text-sm text-emerald-700/80">当前课程已有可用于上课模式的案例，可直接查看，也可修改配置后重新生成。</p>
            </div>
            <button onClick={() => setStep(1)} className="px-5 py-2.5 rounded-lg text-sm font-bold bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-50 shadow-sm transition-colors flex items-center justify-center">
              <RefreshCw className="w-4 h-4 mr-2" /> 修改 / 重新生成
            </button>
          </div>

          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-5">
            {generatedCases.map((generatedCase) => (
              <div key={generatedCase.type} className="border border-slate-200 rounded-xl p-6 bg-white shadow-sm flex flex-col">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className={`p-3 rounded-lg ${generatedCase.type === 'project' ? 'bg-indigo-50 text-indigo-600' : 'bg-sky-50 text-sky-600'}`}>
                    {generatedCase.type === 'project' ? <FileText className="w-6 h-6" /> : <Layers className="w-6 h-6" />}
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">已生成</span>
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">{generatedCase.title}</h4>
                <p className="text-sm text-slate-500 leading-relaxed mb-6 flex-1">{generatedCase.desc}</p>
                <button onClick={() => { setCaseType(generatedCase.type); setStep(3); }} className="w-full py-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold transition-colors flex items-center justify-center">
                  <MonitorPlay className="w-4 h-4 mr-2" /> 查看已生成案例
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

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

  const optionsDefault = [
    { title: '严谨求实的科学态度', desc: '在电工测量中，数据的准确性是一切工作的基础。这映射到做人做事，要求我们实事求是，追求真理，拒绝虚假。' },
    { title: '精益求精的工匠精神', desc: '仪表的精度不断提升，代表了人类对完美的追求。在各自岗位上追求卓越，正是大国工匠精神的体现。' },
    { title: '安全意识与责任担当', desc: '电力系统的测量直接关系到生产安全。我们必须树立安全第一的理念，对每一个数据负责，对每一个生命负责。' },
    { title: '创新精神与时代担当', desc: '从模拟仪表到数字仪表，技术的创新永无止境。我们要勇于探索，用创新驱动发展，担当起时代赋予的使命。' }
  ];

  const isCourseA = activeCourse === '第一章第4-6节 误差的表示和消除';
  let currentOptions;
  if (activeCourse === '第一章第4-6节 误差的表示和消除') {
    currentOptions = optionsA;
  } else if (activeCourse === '第四章第1-5节 频率与相位的测量') {
    currentOptions = optionsB;
  } else {
    currentOptions = optionsDefault;
  }

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
    <div className="w-full max-w-5xl mx-auto flex-1 min-h-0 overflow-y-auto pb-12 pr-2 custom-scrollbar flex flex-col items-center">
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

      {step === 5 && (() => { const guide = teachingGuides[activeCourse] || teachingGuides["第一章第4-6节 误差的表示和消除"]; return (
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
                  {guide.step1.script.replace('{topic}', topic)}
                </p>
              </div>
              <div className="flex items-start">
                <FileQuestion className="w-5 h-5 text-slate-400 mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-slate-600 font-medium">
                  {guide.step1.question}
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
                    {guide.step2.script.replace('{topic}', topic)}
                  </p>
                </div>
                <div className="flex items-start">
                  <FileQuestion className="w-5 h-5 text-slate-400 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-slate-600 font-medium">
                    {guide.step2.question}
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
                  {guide.step3.script.replace('{topic}', topic)}
                </p>
              </div>
              <div className="flex items-start">
                <BookOpen className="w-5 h-5 text-teal-500 mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-teal-700 font-bold">知识点挂载完成：正式进入《{activeCourse}》章节教学环节。</p>
              </div>
            </div>
          </div>
        </div>
      );
        })()
      }
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
    <div className="w-full max-w-5xl mx-auto flex-1 min-h-0 overflow-y-auto pb-12 pr-2 custom-scrollbar animate-in fade-in duration-500">
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
    <div className="w-full max-w-4xl mx-auto flex flex-col flex-1 min-h-0 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
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
    <div className="w-full max-w-6xl mx-auto flex-1 min-h-0 overflow-y-auto pb-12 pr-2 custom-scrollbar animate-in fade-in duration-500">
      
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
    <div className="w-full max-w-6xl mx-auto flex-1 min-h-0 overflow-y-auto pb-12 pr-2 custom-scrollbar animate-in fade-in duration-500">
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
export const SubPageView = ({ title, icon: Icon, colorClass, isAnimating, navigateTo, completedModules, isCourseBuilt, setIsCourseBuilt, ideologicalState, caseGenerationState, activeCourse, setActiveCourse, homeworkState, evaluationState }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedCourseTemp, setSelectedCourseTemp] = useState(null);

  const [prepPhase, setPrepPhase] = useState(() => {
    if (title !== '备课') return 'grid';
    return 'grid'; // 默认直接显示课程模块页面（复用上课模式）
  });
  
  const [expandedCourseOutline, setExpandedCourseOutline] = useState(null);
  const [expandedKnowledgePoint, setExpandedKnowledgePoint] = useState(null);
  
  const [knowledgePoints, setKnowledgePoints] = useState({
      "第一章第1-3节 电工仪表与测量的基本方法": "电工测量的基本概念与任务\n电工仪表的分类与基本组成\n测量方法的分类：直接测量、间接测量、比较测量\n测量系统的组成与测量过程分析",
      "第一章第4-6节 误差的表示和消除": "绝对误差、相对误差与引用误差\n系统误差、随机误差与粗大误差\n仪表准确度等级与测量结果评价\n误差来源分析与误差消除方法",
      "第二章第1-2节 电压与电流的测量&磁电系仪表": "电压测量与电流测量的基本原理\n电压表、电流表的接入方式\n磁电系仪表的结构与工作原理\n仪表内阻对测量结果的影响",
      "第二章第3-4节 磁电系检流计&电磁系仪表": "磁电系检流计的灵敏度与使用方法\n电磁系仪表的结构与转矩形成原理\n交直流测量中的仪表适用性\n检流计在桥式测量中的应用",
      "第二章第5-7节 电动系仪表&万用电表": "电动系仪表的工作原理与特点\n电动系仪表在功率测量中的应用\n万用表的基本结构与测量功能\n万用表使用中的量程选择与误差控制",
      "第二章第8-10节 直流电位差计&电子系电压表": "直流电位差计的补偿测量原理\n标准电池与工作电流校准\n电子电压表的输入阻抗与测量特点\n高阻抗测量对电路状态的影响",
      "第三章第1-4节 功率与电能的测量": "单相有功功率测量原理\n功率表的接线方式与读数方法\n电能测量的基本原理\n功率因数对测量结果的影响",
      "第三章第5-7节 三相有功电能表": "三相有功功率的测量方法\n三相电能表的结构与工作原理\n三相三线制与三相四线制电能测量\n三相负载不平衡对电能计量的影响",
      "第三章第8-9节 电子式单相&三相电能表": "电子式电能表的采样与计量原理\n电压、电流信号调理与数字化处理\n单相与三相电子式电能表的功能差异\n智能电能表的数据通信与误差分析",
      "第四章第1-5节 频率与相位的测量": "频率测量的基本方法\n相位差测量的基本原理\n电子计数法测频原理\n相序判断与相位差测定方法",
      "第五章第1-3节 电路参数的测量（一）": "电阻测量的基本方法\n伏安法测电阻及误差分析\n电桥法测量电阻\n接触电阻与引线电阻的影响",
      "第五章第4-7节 电路参数的测量（二）": "电感参数的测量方法\n电容参数的测量方法\n交流电桥测量原理\nQ值、损耗角与等效参数分析",
      "第六章第1-7节 波形的测量": "示波器的基本结构与工作原理\n电压幅值、周期与频率的波形测量\n波形失真与噪声观察\n示波器探头衰减与测量误差",
      "第八章第1-4节 数字电压表": "数字电压表的基本组成\nA/D 转换原理与测量分辨率\n量程切换与输入阻抗\n数字电压表的误差来源与性能指标",
      "第九章第1-3节 数字功率表&第十章第1-3节 数字频率表": "数字功率表的采样测量原理\n有功功率、无功功率与功率因数计算\n数字频率表的计数测频原理\n采样窗口、闸门时间与测量精度",
      "第十一章第1-3节 数字参数测量仪&第十二章第1-4节 数字示波器": "数字参数测量仪的功能与应用\n电阻、电容、电感等参数的自动测量\n数字示波器的采样、存储与显示原理\n数字示波器在异常波形分析中的应用"
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
      const courseIndex = courseList.indexOf(currentCourse);
      const isInteractiveCourse = courseIndex >= 0 && courseIndex < 6; // 前6个可互动课程
      const szCount = (isInteractiveCourse && ideologicalState[currentCourse]?.isCompletedOnce) ? 1 : 0;
      
      let caseCount = 0;
      if (isInteractiveCourse && caseGenerationState[currentCourse]) {
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
    if (mode === '上课') {
      const caseCount = getModalOptions('上课', currentCourse).length;
      return (
        <div className="flex gap-2 mt-4">
          <span className={`text-xs font-medium px-2 py-1 rounded border ${caseCount > 0 ? 'text-teal-600 bg-teal-50 border-teal-100' : 'text-slate-500 bg-slate-100 border-slate-200'}`}>
            {caseCount > 0 ? `已生成${caseCount}个案例` : '暂未生成案例'}
          </span>
        </div>
      );
    }
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

  const reqModules = selectedCourseTemp ? getModalOptions('上课', selectedCourseTemp).map(opt => opt.label) : [];
  const isAllRequiredCompleted = reqModules.length > 0 && reqModules.every(m => completedModules.includes(m));
  const evaluationLockText = reqModules.length > 1 ? '请先完成上方全部实训以解锁' : '请先完成上方实训以解锁';

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
                      <UploadCloud className="w-4 h-4 mr-2" /> 重新导入 / 重新生成
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {courseList.map((course, idx) => {
                    const points = knowledgePoints[course] ? knowledgePoints[course].split('\n') : [];
                    const isLocked = idx >= 6; // 第三章开始（索引6）锁定
                    
                    if (isLocked) {
                      return (
                        <div 
                          key={idx} 
                          className="p-4 rounded-xl border bg-slate-50 text-slate-400 flex flex-col justify-between transition-all duration-300 border-slate-200 cursor-not-allowed opacity-70"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              <Lock className="w-4 h-4" />
                              <div className="text-sm font-medium leading-relaxed">{course}</div>
                            </div>
                            <span className="text-xs bg-slate-200 px-2 py-0.5 rounded-full">已锁定</span>
                          </div>
                          
                          {points.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-slate-200">
                              <div className="flex flex-wrap gap-2">
                                {points.map((point, pIdx) => (
                                  <span 
                                    key={pIdx}
                                    className="text-xs bg-slate-200 text-slate-500 px-2 py-1 rounded-full border border-slate-300"
                                  >
                                    {point}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {renderTags(title, course)}
                        </div>
                      );
                    }
                    
                    return (
                      <div 
                        key={idx} 
                        onClick={() => handleCourseClick(course)}
                        className="p-4 rounded-xl border bg-white text-slate-700 flex flex-col justify-between transition-all duration-300 border-slate-200 hover:border-teal-400 hover:shadow-md cursor-pointer hover:-translate-y-1"
                      >
                        <div className="text-sm font-medium leading-relaxed">{course}</div>

                        {points.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-slate-100">
                            <div className="flex flex-wrap gap-2">
                              {points.map((point, pIdx) => (
                                <span 
                                  key={pIdx}
                                  className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full border border-slate-200"
                                >
                                  {point}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
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
                           if (opt.label === '案例生成') isModuleCompleted = hasGeneratedCase(caseGenerationState[selectedCourseTemp]);
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

                  {title === '上课' && reqModules.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-slate-100">
                      <button disabled={!isAllRequiredCompleted} onClick={() => { setShowModal(false); setActiveCourse(selectedCourseTemp); navigateTo('上课-课堂评价'); }} className={`w-full py-4 rounded-xl flex items-center justify-center font-bold transition-all ${isAllRequiredCompleted ? 'bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white shadow-lg transform hover:-translate-y-0.5 cursor-pointer' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}>
                        {!isAllRequiredCompleted && <Lock className="w-5 h-5 mr-2 opacity-60" />}
                        {isAllRequiredCompleted && <BarChart3 className="w-5 h-5 mr-2" />}
                        课堂评价 {isAllRequiredCompleted ? '' : `(${evaluationLockText})`}
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

export const ActionDetailView = ({ pageKey, activeCourse, isAnimating, navigateTo, ideologicalState, updateIdeologicalState, caseGenerationState, updateCaseGenerationState, homeworkState, updateHomeworkState, updateEvaluationState }) => {
  const [parentMode, actionName] = pageKey.split('-');
  
  let parentInfo = { icon: BookOpen, colorClass: 'bg-gradient-to-r from-blue-600 to-blue-500' };
  if (parentMode === '上课') parentInfo = { icon: MonitorPlay, colorClass: 'bg-gradient-to-r from-teal-600 to-teal-500' };
  if (parentMode === '课后') parentInfo = { icon: ClipboardCheck, colorClass: 'bg-gradient-to-r from-indigo-600 to-indigo-500' };
  const ParentIcon = parentInfo.icon;

  let iframeContent = null;
  if (actionName === '电工测量方法排障实训') iframeContent = basicMeasurementTroubleshootingHTML;
  else if (actionName === '智能工厂配电系统故障诊断') iframeContent = ghostTrippingHTML;
  else if (actionName === '电压表出厂校验闯关') iframeContent = voltmeterSimHTML;
  else if (actionName === '电压电流与磁电系仪表接入排障') iframeContent = voltageCurrentMagnetoelectricCaseHTML;
  else if (actionName === '检流计零位漂移与电磁系仪表排障') iframeContent = galvanometerElectromagneticCaseHTML;
  else if (actionName === '电动系功率表与万用表量程排障') iframeContent = dynamometerMultimeterCaseHTML;
  else if (actionName === '直流电位差计与电子电压表高阻排障') iframeContent = potentiometerElectronicVoltmeterCaseHTML;
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
          
          <div className={`flex-grow flex flex-col text-slate-400 bg-slate-50/50 ${iframeContent ? 'p-0 overflow-hidden' : 'p-6'}`}>
            {iframeContent ? (
              <iframe srcDoc={iframeContent} className="w-full h-full min-h-[850px] border-none" title={actionName} sandbox="allow-scripts allow-same-origin" />
            ) : actionName === '评价结果' ? (
              <div className="w-full flex-1 min-h-0 flex flex-col">
                <EvaluationReportView activeCourse={activeCourse} />
              </div>
            ) : actionName === '课堂评价' ? (
              <div className="w-full flex-1 min-h-0 flex flex-col"><ClassroomEvaluationView activeCourse={activeCourse} /></div>
            ) : actionName === '布置作业' ? (
              <div className="w-full flex-1 min-h-0 flex flex-col">
                <HomeworkAssignmentView 
                  activeCourse={activeCourse} 
                  isAssigned={homeworkState && homeworkState[activeCourse]} 
                  setAssigned={(val) => updateHomeworkState(activeCourse, val)} 
                />
              </div>
            ) : actionName === '思政导入' ? (
              <div className="w-full flex-1 min-h-0 flex flex-col">
                <IdeologicalImportView activeCourse={activeCourse} ideologicalState={ideologicalState[activeCourse]} setIdeologicalState={(updater) => updateIdeologicalState(activeCourse, updater)} />
              </div>
            ) : actionName === '案例生成' ? (
              <div className="w-full flex-1 min-h-0 flex flex-col">
                <CaseGenerationView activeCourse={activeCourse} generatedCaseState={caseGenerationState[activeCourse]} setCaseGenerationState={(updater) => updateCaseGenerationState(activeCourse, updater)} />
              </div>
            ) : (
              <div className="w-full flex-1 min-h-0 flex flex-col"><AIGeneratorView actionName={actionName} courseName={activeCourse} /></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
