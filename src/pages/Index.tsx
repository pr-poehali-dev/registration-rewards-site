import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

const API_URL = 'https://functions.poehali.dev/a7ce37ac-4dac-469a-ac18-c44f893f499b';

interface User {
  id: number;
  email: string;
  username: string;
}

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [registerData, setRegisterData] = useState({
    email: '',
    username: '',
    password: '',
  });

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'register',
          ...registerData,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data);
        toast({
          title: 'Добро пожаловать!',
          description: 'Регистрация успешна',
        });
      } else {
        toast({
          title: 'Ошибка',
          description: data.error || 'Не удалось зарегистрироваться',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Проблема с подключением к серверу',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'login',
          ...loginData,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data);
        toast({
          title: 'С возвращением!',
          description: 'Вы вошли в систему',
        });
      } else {
        toast({
          title: 'Ошибка',
          description: data.error || 'Неверные данные для входа',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Проблема с подключением к серверу',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };



  const handleLogout = () => {
    setUser(null);
    setRegisterData({ email: '', username: '', password: '' });
    setLoginData({ email: '', password: '' });
    toast({
      title: 'Выход выполнен',
      description: 'До скорой встречи!',
    });
  };

  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl border-border/50 animate-scale-in">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4 animate-fade-in">
              <Icon name="User" size={40} className="text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight">{user.username}</CardTitle>
            <CardDescription className="text-base">{user.email}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-8 rounded-xl text-center space-y-2">
              <p className="text-lg text-muted-foreground">Добро пожаловать в личный кабинет</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="w-full transition-all hover:scale-105"
            >
              <Icon name="LogOut" className="mr-2" size={18} />
              Выйти
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-border/50 animate-scale-in">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4 animate-fade-in">
            <Icon name="Sparkles" size={40} className="text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight">Личный кабинет</CardTitle>
          <CardDescription className="text-base">
            Зарегистрируйтесь или войдите в систему
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login" className="transition-all">Вход</TabsTrigger>
              <TabsTrigger value="register" className="transition-all">Регистрация</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4 animate-fade-in">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="your@email.com"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    required
                    className="transition-all focus:scale-105"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Пароль</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    required
                    className="transition-all focus:scale-105"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 font-semibold transition-all hover:scale-105"
                >
                  {loading ? 'Загрузка...' : 'Войти'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register" className="space-y-4 animate-fade-in">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-username">Имя пользователя</Label>
                  <Input
                    id="register-username"
                    type="text"
                    placeholder="JohnDoe"
                    value={registerData.username}
                    onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                    required
                    className="transition-all focus:scale-105"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="your@email.com"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    required
                    className="transition-all focus:scale-105"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password">Пароль</Label>
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="••••••••"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    required
                    className="transition-all focus:scale-105"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 font-semibold transition-all hover:scale-105"
                >
                  {loading ? 'Загрузка...' : 'Зарегистрироваться'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;