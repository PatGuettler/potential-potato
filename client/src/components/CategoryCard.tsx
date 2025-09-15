import { Link } from "wouter";

interface CategoryCardProps {
  name: string;
  icon: string;
  description: string;
  gradient: string;
  href: string;
}

export function CategoryCard({ name, icon, description, gradient, href }: CategoryCardProps) {
  return (
    <Link href={href}>
      <a 
        className="bg-card rounded-lg p-6 border border-border shadow-sm hover:shadow-md transition-shadow cursor-pointer group block"
        data-testid={`category-card-${name.toLowerCase()}`}
      >
        <div className="text-center">
          <div className={`w-16 h-16 ${gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform`}>
            <i className={`${icon} text-white text-2xl`}></i>
          </div>
          <h4 className="font-semibold mb-2" data-testid={`category-title-${name.toLowerCase()}`}>{name}</h4>
          <p className="text-sm text-muted-foreground mb-4" data-testid={`category-description-${name.toLowerCase()}`}>
            {description}
          </p>
          <div className="flex justify-center space-x-1">
            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded" data-testid={`category-easy-${name.toLowerCase()}`}>
              Easy: 20
            </span>
            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded" data-testid={`category-medium-${name.toLowerCase()}`}>
              Medium: 20
            </span>
            <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded" data-testid={`category-hard-${name.toLowerCase()}`}>
              Hard: 20
            </span>
          </div>
        </div>
      </a>
    </Link>
  );
}
