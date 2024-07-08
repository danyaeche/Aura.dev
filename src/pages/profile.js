import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

export default function Profile() {
  const [user, setUser] = useState({ name: '', email: '' });
  const router = useRouter();
  const { data: session } = useSession();
  const { toast } = useToast();

  useEffect(() => {
    if (session) {
      setUser({
        name: session.user.name || '',
        email: session.user.email || '',
      });
    }
  }, [session]);

  if (!session) {
    router.push('/login');
    return null;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser(prevUser => ({ ...prevUser, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would send this data to your API
    console.log('Updated user profile:', user);
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">User Profile</h1>
      <Card>
        <CardHeader>
          <CardTitle>Edit Your Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={user.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={user.email}
                onChange={handleInputChange}
              />
            </div>
            <Button type="submit">Save Changes</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}