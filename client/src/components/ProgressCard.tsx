interface ProgressCardProps {
  title: string;
  icon: string;
  iconColor: string;
  completed: number;
  total: number;
  progress: number;
}

export function ProgressCard({ 
  title, 
  icon, 
  iconColor, 
  completed, 
  total, 
  progress 
}: ProgressCardProps) {
  return (
    <div className="bg-card rounded-lg p-6 border border-border shadow-sm" data-testid={`progress-card-${title.toLowerCase()}`}>
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 ${iconColor} rounded-lg flex items-center justify-center`}>
          <i className={`${icon} ${iconColor.includes('blue') ? 'text-blue-600' : 
            iconColor.includes('purple') ? 'text-purple-600' :
            iconColor.includes('green') ? 'text-green-600' : 'text-orange-600'}`}></i>
        </div>
        <span className="text-sm text-muted-foreground" data-testid={`progress-fraction-${title.toLowerCase()}`}>
          {completed}/{total}
        </span>
      </div>
      <h4 className="font-semibold mb-2" data-testid={`progress-title-${title.toLowerCase()}`}>{title}</h4>
      <div className="w-full bg-muted rounded-full h-2 mb-2">
        <div 
          className="lesson-progress-bar h-2 rounded-full" 
          style={{ width: `${progress}%` }}
          data-testid={`progress-bar-${title.toLowerCase()}`}
        ></div>
      </div>
      <p className="text-xs text-muted-foreground" data-testid={`progress-percentage-${title.toLowerCase()}`}>
        {progress}% Complete
      </p>
    </div>
  );
}
