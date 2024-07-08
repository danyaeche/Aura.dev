import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

const PricingTier = ({ name, price, features, recommended }) => (
  <Card className={`flex flex-col ${recommended ? 'border-primary' : ''}`}>
    <CardHeader>
      <CardTitle>{name}</CardTitle>
      <CardDescription>
        <span className="text-3xl font-bold">${price}</span> / month
      </CardDescription>
    </CardHeader>
    <CardContent className="flex-grow">
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <Check className="h-5 w-5 text-green-500 mr-2" />
            {feature}
          </li>
        ))}
      </ul>
    </CardContent>
    <CardFooter>
      <Button className="w-full" variant={recommended ? 'default' : 'outline'}>
        Choose Plan
      </Button>
    </CardFooter>
  </Card>
);

export default function Pricing() {
  const tiers = [
    {
      name: "Basic",
      price: 9.99,
      features: [
        "Up to 100 3D assets",
        "Basic labeling",
        "5GB storage",
        "Email support"
      ]
    },
    {
      name: "Pro",
      price: 29.99,
      features: [
        "Unlimited 3D assets",
        "Advanced labeling",
        "50GB storage",
        "Priority support",
        "Team collaboration"
      ],
      recommended: true
    },
    {
      name: "Enterprise",
      price: 99.99,
      features: [
        "Unlimited 3D assets",
        "Custom labeling system",
        "500GB storage",
        "24/7 dedicated support",
        "Advanced analytics",
        "API access"
      ]
    }
  ];

  return (
    <div className="py-12">
      <h1 className="text-3xl font-bold text-center mb-6">Choose Your Plan</h1>
      <p className="text-xl text-center text-gray-600 mb-12">
        Select the perfect plan for your 3D asset management needs
      </p>
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
        {tiers.map((tier, index) => (
          <PricingTier key={index} {...tier} />
        ))}
      </div>
    </div>
  );
}