import { useState } from 'react';
import StudyPlanner from './StudyPlanner';
import BacklogView from './BacklogView';

const CalendarView = () => {
    const [view, setView] = useState('planner');
    return view === 'backlog' ? <BacklogView /> : <StudyPlanner />;
};

export default CalendarView;
