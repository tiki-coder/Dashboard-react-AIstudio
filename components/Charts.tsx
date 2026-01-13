
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { MarkRecord, ScoreRecord } from '../types';

interface ChartsProps {
  filteredMarks: MarkRecord[];
  filteredScores: ScoreRecord[];
}

const Charts: React.FC<ChartsProps> = ({ filteredMarks, filteredScores }) => {
  // Aggregate Marks distribution
  const marksData = useMemo(() => {
    if (filteredMarks.length === 0) return [];
    
    let m2 = 0, m3 = 0, m4 = 0, m5 = 0, totalP = 0;
    filteredMarks.forEach(m => {
      totalP += m.participants;
      m2 += (m.mark2 * m.participants) / 100;
      m3 += (m.mark3 * m.participants) / 100;
      m4 += (m.mark4 * m.participants) / 100;
      m5 += (m.mark5 * m.participants) / 100;
    });

    // Fix: Helper function to safely calculate percentages and resolve arithmetic operation errors
    const getPercentage = (val: number) => totalP > 0 ? Number(((val / totalP) * 100).toFixed(2)) : 0;

    return [
      { name: '2', value: getPercentage(m2), color: '#ef4444' },
      { name: '3', value: getPercentage(m3), color: '#f59e0b' },
      { name: '4', value: getPercentage(m4), color: '#10b981' },
      { name: '5', value: getPercentage(m5), color: '#3b82f6' }
    ];
  }, [filteredMarks]);

  // Aggregate Primary Scores distribution
  const scoresData = useMemo(() => {
    if (filteredScores.length === 0) return [];

    const scoreMap: Record<number, number> = {};
    let totalP = 0;

    filteredScores.forEach(s => {
      totalP += s.participants;
      Object.entries(s.scores).forEach(([score, percentage]) => {
        const sc = parseInt(score);
        scoreMap[sc] = (scoreMap[sc] || 0) + (percentage * s.participants) / 100;
      });
    });

    const maxScore = Math.max(...Object.keys(scoreMap).map(Number), 0);
    const result = [];
    for (let i = 0; i <= maxScore; i++) {
      // Fix: Resolve "The left-hand side of an arithmetic operation..." by clarifying the calculation steps
      const currentScoreCount = scoreMap[i] || 0;
      const calculatedPercentage = totalP > 0 ? (currentScoreCount / totalP) * 100 : 0;
      
      result.push({
        score: i,
        percentage: Number(calculatedPercentage.toFixed(2))
      });
    }
    return result;
  }, [filteredScores]);

  const cardStyle = "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm overflow-hidden h-[450px]";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Marks Distribution */}
      <div className={cardStyle}>
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1.5 h-4 bg-blue-500 rounded-full"></div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-tight">Распределение отметок (%)</h3>
        </div>
        <div className="h-[340px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={marksData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.1} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
              <YAxis hide />
              <Tooltip 
                cursor={{ fill: 'transparent' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', backgroundColor: '#1e293b', color: '#fff' }}
                formatter={(value: any) => [`${value}%`, 'Доля']}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={60}>
                {marksData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
                <LabelList dataKey="value" position="top" formatter={(v: any) => `${v}%`} style={{ fontSize: '11px', fontWeight: 'bold', fill: '#64748b' }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Primary Score Distribution */}
      <div className={cardStyle}>
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1.5 h-4 bg-blue-500 rounded-full"></div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-tight">Распределение первичных баллов (%)</h3>
        </div>
        <div className="h-[340px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={scoresData} margin={{ top: 20, right: 10, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.1} />
              <XAxis dataKey="score" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} dy={10} />
              <YAxis hide />
              <Tooltip 
                cursor={{ fill: 'transparent' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', backgroundColor: '#1e293b', color: '#fff' }}
                formatter={(value: any) => [`${value}%`, 'Доля']}
              />
              <Bar dataKey="percentage" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Charts;
