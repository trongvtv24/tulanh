import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Book,
  CheckSquare,
  Trophy,
  Star,
  Sparkles,
} from "lucide-react";

export function LandingPage() {
  return (
    <div className="flex flex-col">
      {/* Compact Hero + Features Combined */}
      <section className="relative py-12 lg:py-16">
        {/* Subtle Background */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 to-transparent" />

        <div className="container max-w-5xl mx-auto px-4">
          {/* Mini Hero */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary mb-4">
              <Sparkles className="h-3.5 w-3.5" />
              Vietnam Social for Builders
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
              Quản lý bản thân. Thăng cấp mỗi ngày.
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto text-sm sm:text-base">
              Công cụ dành cho Winner và Vozer: Nhật ký, Todo List, và hệ thống
              XP giúp bạn duy trì động lực.
            </p>
            <div className="flex gap-3 justify-center mt-6">
              <Button size="sm" className="rounded-full px-6" asChild>
                <Link href="/auth">
                  Bắt đầu ngay <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Feature Cards - Compact Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FeatureCard
              icon={<Book className="h-5 w-5 text-orange-500" />}
              title="Nhật Ký"
              description="Ghi lại bài học và suy ngẫm hàng ngày"
              color="orange"
            />
            <FeatureCard
              icon={<CheckSquare className="h-5 w-5 text-blue-500" />}
              title="Todo List"
              description="Quản lý công việc đơn giản, hiệu quả"
              color="blue"
            />
            <FeatureCard
              icon={<Trophy className="h-5 w-5 text-yellow-500" />}
              title="XP & Level"
              description="Tích điểm, thăng cấp, mở khóa nội dung"
              color="yellow"
            />
          </div>
        </div>
      </section>

      {/* Gamification Preview - Compact */}
      <section className="py-10 px-4">
        <div className="container max-w-4xl mx-auto">
          <div className="bg-card border rounded-2xl p-6 md:p-8 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative z-10">
              {/* Left - Info */}
              <div className="space-y-4">
                <div className="inline-flex items-center gap-1.5 text-yellow-600 font-medium bg-yellow-500/10 px-2.5 py-1 rounded-full text-xs">
                  <Star className="h-3 w-3 fill-current" />
                  Hệ thống Level
                </div>
                <h2 className="text-xl md:text-2xl font-bold">
                  Thăng hạng để nhận quyền lợi
                </h2>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                      1
                    </span>
                    Nhận XP khi hoàn thành công việc
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                      2
                    </span>
                    Level thể hiện độ uy tín của bạn
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                      3
                    </span>
                    Mở khóa nội dung độc quyền
                  </li>
                </ul>
              </div>

              {/* Right - Level Card Preview */}
              <div className="relative">
                <div className="bg-background border rounded-xl p-4 space-y-3 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-9 w-9 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                        <Trophy className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm">Legend</h3>
                        <p className="text-xs text-muted-foreground">
                          Level 5 (MAX)
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold font-mono text-primary">
                        5,000
                      </span>
                      <span className="text-xs text-muted-foreground ml-0.5">
                        XP
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">
                        Đã đạt cấp tối đa!
                      </span>
                      <span className="font-medium text-yellow-500">★ MAX</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 w-full" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className="bg-muted/50 rounded-lg p-2 text-center">
                      <div className="text-xs font-medium">Viết bài</div>
                      <div className="text-xs text-green-500 font-semibold">
                        +50 XP
                      </div>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-2 text-center">
                      <div className="text-xs font-medium">Nhật ký</div>
                      <div className="text-xs text-green-500 font-semibold">
                        +20 XP
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA - Minimal */}
      <section className="py-10 text-center px-4">
        <div className="max-w-md mx-auto space-y-4">
          <h2 className="text-xl font-bold">Sẵn sàng thử?</h2>
          <p className="text-sm text-muted-foreground">
            Tham gia miễn phí để quản lý công việc và theo dõi sự phát triển của
            bạn.
          </p>
          <Button className="rounded-full px-6" asChild>
            <Link href="/auth">Đăng Ký Miễn Phí</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: "orange" | "blue" | "yellow";
}) {
  const colorClasses = {
    orange: "bg-orange-500/10 group-hover:bg-orange-500/20",
    blue: "bg-blue-500/10 group-hover:bg-blue-500/20",
    yellow: "bg-yellow-500/10 group-hover:bg-yellow-500/20",
  };

  return (
    <div className="group p-5 rounded-xl bg-card border hover:border-primary/30 transition-all duration-200 hover:shadow-md">
      <div
        className={`h-10 w-10 rounded-lg ${colorClasses[color]} flex items-center justify-center mb-3 transition-colors`}
      >
        {icon}
      </div>
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-xs text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
}
