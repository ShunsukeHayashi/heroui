import React from "react";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";

interface UsageTipsProps {
  userPhase: "onboarding" | "exploration" | "retention" | "power-user";
}

export const UsageTips: React.FC<UsageTipsProps> = ({ userPhase }) => {
  // Phase-specific tips
  const getTips = () => {
    switch (userPhase) {
      case "onboarding":
        return [
          {
            title: "最初のプロジェクトを作成",
            description: "新規プロジェクトを作成して、キャンバスに描いてみましょう",
            icon: "lucide:plus-circle",
            action: "作成する",
            color: "primary"
          },
          {
            title: "テキストから画像を生成",
            description: "プロンプトを入力して、AIに画像を生成させましょう",
            icon: "lucide:text",
            action: "試してみる",
            color: "secondary"
          }
        ];
      case "exploration":
        return [
          {
            title: "画像から画像を生成",
            description: "スケッチやラフ画像からAIに生成させましょう",
            icon: "lucide:image",
            action: "試してみる",
            color: "secondary"
          },
          {
            title: "プロジェクトを保存",
            description: "作業を保存して、後で続きから再開できます",
            icon: "lucide:save",
            action: "保存する",
            color: "primary"
          }
        ];
      case "retention":
        return [
          {
            title: "履歴を活用",
            description: "過去の生成結果を検索・フィルタリングして再利用しましょう",
            icon: "lucide:history",
            action: "履歴を見る",
            color: "success"
          },
          {
            title: "タブレットで使う",
            description: "iPadなどのタブレットでも快適に操作できます",
            icon: "lucide:tablet",
            action: "詳細を見る",
            color: "secondary"
          }
        ];
      case "power-user":
        return [
          {
            title: "バッチ処理",
            description: "複数の画像を一括生成・エクスポートしましょう",
            icon: "lucide:layers",
            action: "使ってみる",
            color: "warning"
          },
          {
            title: "チームと共有",
            description: "プロジェクトをチームメンバーと共有できます",
            icon: "lucide:users",
            action: "共有する",
            color: "primary"
          }
        ];
      default:
        return [];
    }
  };
  
  const tips = getTips();
  
  return (
    <div className="space-y-4">
      {tips.map((tip, index) => (
        <div key={index} className="flex gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-${tip.color}/10 shrink-0`}>
            <Icon icon={tip.icon} className={`text-${tip.color} text-lg`} />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium">{tip.title}</h3>
            <p className="text-xs text-default-500">{tip.description}</p>
            <Button
              size="sm"
              variant="light"
              color={tip.color as "primary" | "secondary" | "success" | "warning"}
              className="mt-1 px-0"
            >
              {tip.action}
            </Button>
          </div>
        </div>
      ))}
      
      <div className="pt-2">
        <Button
          size="sm"
          variant="flat"
          startContent={<Icon icon="lucide:book-open" />}
          className="w-full"
        >
          ヘルプセンターを見る
        </Button>
      </div>
    </div>
  );
};