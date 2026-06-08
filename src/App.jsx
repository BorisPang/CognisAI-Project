import React, { useState, useEffect } from 'react';
import { BookOpen, ClipboardCheck, MonitorPlay } from 'lucide-react';
import { initialIdeologicalState } from './data/courseData.js';
import { ActionDetailView, HomeView, Navbar, SubPageView } from './views/AppViews.jsx';

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [activeCourse, setActiveCourse] = useState('第一章第4-6节 误差的表示和消除');
  const [isAnimating, setIsAnimating] = useState(false);
  const [completedModules, setCompletedModules] = useState([]);
  const [isCourseBuilt, setIsCourseBuilt] = useState(false);

  // 为每个课程维持独立的全局状态记忆
  const [ideologicalState, setIdeologicalState] = useState(initialIdeologicalState);

  const [caseGenerationState, setCaseGenerationState] = useState({
    "第一章第1-3节 电工仪表与测量的基本方法": { project: false, circuit: false },
    "第一章第4-6节 误差的表示和消除": { project: false, circuit: false },
    "第二章第1-2节 电压与电流的测量&磁电系仪表": { project: false, circuit: false },
    "第二章第3-4节 磁电系检流计&电磁系仪表": { project: false, circuit: false },
    "第二章第5-7节 电动系仪表&万用电表": { project: false, circuit: false },
    "第二章第8-10节 直流电位差计&电子系电压表": { project: false, circuit: false },
    "第四章第1-5节 频率与相位的测量": { project: false, circuit: false }
  });

  const [homeworkState, setHomeworkState] = useState({
    "第一章第1-3节 电工仪表与测量的基本方法": false,
    "第一章第4-6节 误差的表示和消除": false,
    "第二章第1-2节 电压与电流的测量&磁电系仪表": false,
    "第二章第3-4节 磁电系检流计&电磁系仪表": false,
    "第二章第5-7节 电动系仪表&万用电表": false,
    "第二章第8-10节 直流电位差计&电子系电压表": false,
    "第四章第1-5节 频率与相位的测量": false
  });

  const [evaluationState, setEvaluationState] = useState({
    "第一章第1-3节 电工仪表与测量的基本方法": false,
    "第一章第4-6节 误差的表示和消除": false,
    "第二章第1-2节 电压与电流的测量&磁电系仪表": false,
    "第二章第3-4节 磁电系检流计&电磁系仪表": false,
    "第二章第5-7节 电动系仪表&万用电表": false,
    "第二章第8-10节 直流电位差计&电子系电压表": false,
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
