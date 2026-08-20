import React from 'react';
import {
  Apple,
  Milk,
  Wheat,
  Beef,
  Soup,
  Coffee,
  Cookie,
  Sparkles,
  Smile,
  Package,
  LucideProps,
} from 'lucide-react';
import { ItemCategory } from '../../types/shopping';

interface CategoryIconProps extends LucideProps {
  category: ItemCategory | string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ category, className = 'w-4 h-4', ...props }) => {
  switch (category) {
    case 'produce':
      return <Apple className={className} {...props} />;
    case 'dairy':
      return <Milk className={className} {...props} />;
    case 'bakery':
      return <Wheat className={className} {...props} />;
    case 'meat':
      return <Beef className={className} {...props} />;
    case 'pantry':
      return <Soup className={className} {...props} />;
    case 'beverages':
      return <Coffee className={className} {...props} />;
    case 'snacks':
      return <Cookie className={className} {...props} />;
    case 'household':
      return <Sparkles className={className} {...props} />;
    case 'personal_care':
      return <Smile className={className} {...props} />;
    default:
      return <Package className={className} {...props} />;
  }
};
