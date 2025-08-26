import type { Recipe } from '../types';

export const mockRecipes: Recipe[] = [
  {
    id: '1',
    title: 'Classic Pour Over',
    description: 'A clean and bright drip coffee with floral notes',
    brewType: 'drip',
    difficulty: 'medium',
    prepTime: 8,
    rating: 4.5,
    author: 'Sarah Chen',
    ingredients: ['25g medium-fine ground coffee', '400ml water at 200°F', 'Paper filter'],
    instructions: [
      'Heat water to 200°F (93°C)',
      'Rinse filter and warm brewing vessel',
      'Add coffee grounds and create a small well',
      'Pour 50ml water in circular motion, let bloom for 30s',
      'Continue pouring in slow circles, finish by 3:30',
      'Total brew time: 4-5 minutes'
    ],
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    title: 'Perfect Espresso',
    description: 'Rich and creamy espresso with golden crema',
    brewType: 'espresso',
    difficulty: 'hard',
    prepTime: 3,
    rating: 4.8,
    author: 'Marco Rossi',
    ingredients: ['18g finely ground coffee', 'Fresh filtered water', 'Clean portafilter'],
    instructions: [
      'Grind 18g coffee beans to fine consistency',
      'Distribute grounds evenly in portafilter',
      'Tamp with 30lbs pressure',
      'Lock portafilter and start extraction',
      'Extract 36g in 25-30 seconds',
      'Serve immediately'
    ],
    createdAt: new Date('2024-01-20')
  },
  {
    id: '3',
    title: 'French Press Classic',
    description: 'Full-bodied drip coffee with rich, bold flavors',
    brewType: 'drip',
    difficulty: 'easy',
    prepTime: 5,
    rating: 4.2,
    author: 'Emma Johnson',
    ingredients: ['30g coarse ground coffee', '500ml hot water', 'French press'],
    instructions: [
      'Heat water to 200°F (93°C)',
      'Add coarse coffee grounds to french press',
      'Pour hot water over grounds',
      'Stir gently and place lid (don\'t press yet)',
      'Steep for 4 minutes',
      'Press plunger down slowly and serve'
    ],
    createdAt: new Date('2024-01-12')
  },
  {
    id: '4',
    title: 'Cappuccino Perfection',
    description: 'Balanced espresso drink with silky microfoam',
    brewType: 'espresso',
    difficulty: 'hard',
    prepTime: 5,
    rating: 4.7,
    author: 'Antonio Bianchi',
    ingredients: ['18g espresso blend', '150ml whole milk', 'Sugar (optional)'],
    instructions: [
      'Pull a perfect espresso shot into 6oz cup',
      'Pour cold milk into steaming pitcher',
      'Steam milk to 150°F with fine microfoam',
      'Tap pitcher to settle foam',
      'Pour milk starting from height, then close to surface',
      'Create latte art if desired'
    ],
    createdAt: new Date('2024-01-18')
  },
  {
    id: '5',
    title: 'Cold Brew Concentrate',
    description: 'Smooth and refreshing drip coffee concentrate',
    brewType: 'drip',
    difficulty: 'easy',
    prepTime: 720, // 12 hours
    rating: 4.4,
    author: 'Jake Martinez',
    ingredients: ['100g coarse ground coffee', '1L room temperature water', 'Large jar or container'],
    instructions: [
      'Combine coffee and water in large container',
      'Stir well to ensure all grounds are wet',
      'Cover and steep at room temperature for 12 hours',
      'Strain through fine mesh or cheesecloth',
      'Dilute with water or milk to taste',
      'Serve over ice'
    ],
    createdAt: new Date('2024-01-10')
  },
  {
    id: '6',
    title: 'Americano Classic',
    description: 'Espresso-based drink with hot water for drip coffee strength',
    brewType: 'espresso',
    difficulty: 'medium',
    prepTime: 4,
    rating: 4.1,
    author: 'Lisa Park',
    ingredients: ['18g espresso blend', '120ml hot water', 'Cup warmed'],
    instructions: [
      'Pull a double espresso shot',
      'Heat water to 200°F (93°C)',
      'Add hot water to espresso in 2:1 ratio',
      'Stir gently to combine',
      'Serve immediately',
      'Add sugar or milk if desired'
    ],
    createdAt: new Date('2024-01-22')
  }
];