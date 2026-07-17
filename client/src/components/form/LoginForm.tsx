import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import vaadLogo from "@/assets/vaad_logo.png";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { loginSchema, type LoginFormData } from "@/features/auth/validations/login.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLogin } from "@/features/auth/hooks/useLogin";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboardRoute } from "@/utils/getDashboardRoute";
import ButtonLoader from "../common/ButtonLoader";


const LoginForm = () => {

    const [showPassword, setShowPassword] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const navigate = useNavigate();
    const { mutate, isPending  } = useLogin();

    const onSubmit = (data: LoginFormData) => {
        mutate(data, {
            onSuccess: (response) => {
                navigate(getDashboardRoute(response.data.user.role));
            },
        });
    };


    return (
        <Card className="w-full max-w-md rounded-lg border-0 shadow-none">
            <CardHeader className="space-y-1 px-4 pt-6 pb-4 text-center">
                <div className="flex justify-center">
                    <img
                        src={vaadLogo}
                        alt="VAAD HR"
                        className="h-10 w-auto"
                    />
                </div>

                <div className="space-y-1">
                    <CardTitle className="text-2xl font-bold">
                        Welcome Back
                    </CardTitle>

                    <CardDescription>
                        Secure access for VAAD internal operations.
                    </CardDescription>
                </div>
            </CardHeader>

            <CardContent className="px-8 pb-4">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {/* Email */}
                    {/* Email */}
                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>

                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />

                            <Input
                                {...register("email")}
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                className="rounded-sm border-border pl-10"
                            />
                        </div>

                        {errors.email && (
                            <p className="text-sm text-destructive">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                        <Label htmlFor="password">
                            Password
                        </Label>

                        <div className="relative">
                            <Lock
                                className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted"
                            />

                            <Input
                                {...register("password")}
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                className="rounded-sm border-border pl-10 pr-10"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword(!showPassword)}
                                className="absolute top-1/2 right-3 -translate-y-1/2 text-muted hover:text-foreground cursor-pointer"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>

                        {errors.password && (
                            <p className="text-sm text-destructive">
                                {errors.password.message}
                            </p>
                        )}
                    </div>
                    {/* Remember Me */}
                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2">
                            <input type="checkbox" />
                            <span>Remember me</span>
                        </label>

                        <button
                            type="button"
                            className="font-medium text-primary transition-colors hover:underline"
                        >
                            Forgot Password?
                        </button>
                    </div>

                    <Button type="submit" disabled={isPending} className="w-full rounded-sm text-white">
                        {isPending ? (
                            <ButtonLoader text="Signing In..." />
                        ) : (
                            "Sign In"
                        )}
                    </Button>
                </form>

                <div className="mt-3 flex items-center justify-between border-t border-border pt-5 text-sm text-muted-foreground">
                    <span>Don't have an account?</span>

                    <button
                        type="button"
                        className="font-medium text-primary transition-colors hover:underline"
                    >
                        Contact Administrator
                    </button>
                </div>

                <p className="mt-2 text-center text-xs text-muted-foreground">
                    © {new Date().getFullYear()} VAAD HR. All rights reserved.
                </p>
            </CardContent>
        </Card>
    );
};

export default LoginForm;