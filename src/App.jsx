import React, { useState, useEffect } from 'react';
import { BookOpen, ClipboardCheck, MonitorPlay } from 'lucide-react';
import { initialIdeologicalState } from './data/courseData.js';
import { ActionDetailView, HomeView, Navbar, SubPageView } from './views/AppViews.jsx';

const STORAGE_PREFIX = 'cognisai:v1:';
const STORAGE_KEYS = {
  activePage: `${STORAGE_PREFIX}activePage`,
  activeCourse: `${STORAGE_PREFIX}activeCourse`,
  completedModules: `${STORAGE_PREFIX}completedModules`,
  isCourseBuilt: `${STORAGE_PREFIX}isCourseBuilt`,
  ideologicalState: `${STORAGE_PREFIX}ideologicalState`,
  caseGenerationState: `${STORAGE_PREFIX}caseGenerationState`,
  homeworkState: `${STORAGE_PREFIX}homeworkState`,
  evaluationState: `${STORAGE_PREFIX}evaluationState`
};

const defaultCaseGenerationState = {
  "第一章第1-3节 电工仪表与测量的基本方法": { project: true, circuit: false },
  "第一章第4-6节 误差的表示和消除": { project: true, circuit: true },
  "第二章第1-2节 电压与电流的测量&磁电系仪表": { project: true, circuit: false },
  "第二章第3-4节 磁电系检流计&电磁系仪表": { project: true, circuit: false },
  "第二章第5-7节 电动系仪表&万用电表": { project: true, circuit: false },
  "第二章第8-10节 直流电位差计&电子系电压表": { project: true, circuit: false },
  "第四章第1-5节 频率与相位的测量": { project: false, circuit: false }
};

const defaultHomeworkState = {
  "第一章第1-3节 电工仪表与测量的基本方法": false,
  "第一章第4-6节 误差的表示和消除": false,
  "第二章第1-2节 电压与电流的测量&磁电系仪表": false,
  "第二章第3-4节 磁电系检流计&电磁系仪表": false,
  "第二章第5-7节 电动系仪表&万用电表": false,
  "第二章第8-10节 直流电位差计&电子系电压表": false,
  "第四章第1-5节 频率与相位的测量": false
};

const defaultEvaluationState = {
  "第一章第1-3节 电工仪表与测量的基本方法": false,
  "第一章第4-6节 误差的表示和消除": false,
  "第二章第1-2节 电压与电流的测量&磁电系仪表": false,
  "第二章第3-4节 磁电系检流计&电磁系仪表": false,
  "第二章第5-7节 电动系仪表&万用电表": false,
  "第二章第8-10节 直流电位差计&电子系电压表": false,
  "第四章第1-5节 频率与相位的测量": false
};

const isPlainObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);

const mergeObjectState = (defaultValue) => (value) => (
  isPlainObject(value) ? { ...defaultValue, ...value } : defaultValue
);

const persistentValidators = {
  [STORAGE_KEYS.activePage]: (value) => (
    ['home', '备课', '上课', '课后'].includes(value) ? value : 'home'
  ),
  [STORAGE_KEYS.activeCourse]: (value) => (
    typeof value === 'string' ? value : '第一章第4-6节 误差的表示和消除'
  ),
  [STORAGE_KEYS.completedModules]: (value) => (
    Array.isArray(value) ? value.filter(item => typeof item === 'string') : []
  ),
  [STORAGE_KEYS.isCourseBuilt]: (value) => (typeof value === 'boolean' ? value : false),
  [STORAGE_KEYS.ideologicalState]: mergeObjectState(initialIdeologicalState),
  [STORAGE_KEYS.caseGenerationState]: mergeObjectState(defaultCaseGenerationState),
  [STORAGE_KEYS.homeworkState]: mergeObjectState(defaultHomeworkState),
  [STORAGE_KEYS.evaluationState]: mergeObjectState(defaultEvaluationState)
};

const getInitialPersistentValue = (key, defaultValue) => {
  if (typeof window === 'undefined') return defaultValue;

  try {
    const storedValue = window.localStorage.getItem(key);
    if (storedValue === null) return defaultValue;

    const parsedValue = JSON.parse(storedValue);
    return persistentValidators[key]?.(parsedValue) ?? parsedValue;
  } catch (error) {
    console.warn(`Failed to read persisted state for ${key}. Falling back to defaults.`, error);
    return defaultValue;
  }
};

const usePersistentState = (key, defaultValue) => {
  const [value, setValue] = useState(() => getInitialPersistentValue(key, defaultValue));

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`Failed to persist state for ${key}.`, error);
    }
  }, [key, value]);

  return [value, setValue];
};

const clearLocalMemory = () => {
  if (typeof window === 'undefined') return;

  Object.keys(window.localStorage)
    .filter(key => key.startsWith(STORAGE_PREFIX))
    .forEach(key => window.localStorage.removeItem(key));
};

export default function App() {
  const [activePage, setActivePage] = usePersistentState(STORAGE_KEYS.activePage, 'home');
  const [activeCourse, setActiveCourse] = usePersistentState(STORAGE_KEYS.activeCourse, '第一章第4-6节 误差的表示和消除');
  const [isAnimating, setIsAnimating] = useState(false);
  const [completedModules, setCompletedModules] = usePersistentState(STORAGE_KEYS.completedModules, []);
  const [isCourseBuilt, setIsCourseBuilt] = usePersistentState(STORAGE_KEYS.isCourseBuilt, false);

  // 为每个课程维持独立的全局状态记忆
  const [ideologicalState, setIdeologicalState] = usePersistentState(STORAGE_KEYS.ideologicalState, initialIdeologicalState);
  const [caseGenerationState, setCaseGenerationState] = usePersistentState(STORAGE_KEYS.caseGenerationState, defaultCaseGenerationState);
  const [homeworkState, setHomeworkState] = usePersistentState(STORAGE_KEYS.homeworkState, defaultHomeworkState);
  const [evaluationState, setEvaluationState] = usePersistentState(STORAGE_KEYS.evaluationState, defaultEvaluationState);

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

  const handleClearLocalMemory = () => {
    clearLocalMemory();
    window.location.reload();
  };

  return (
    <div className="min-h-screen font-sans bg-slate-50 text-slate-900 selection:bg-teal-200 selection:text-teal-900">
      <Navbar navigateTo={navigateTo} onClearLocalMemory={handleClearLocalMemory} />
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
