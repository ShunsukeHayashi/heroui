import React from "react";
import { Progress } from "@heroui/react";
import { Icon } from "@iconify/react";

export const GenerationStats: React.FC = () => {
  // Simulated stats data - in a real app, this would come from the context or API
  const stats = {
    images: 28,
    videos: 5,
    totalCost: 1.45,
    quota: 5.00,
    usagePercentage: 29,
    mostUsedModel: "Stable Diffusion XL",
    averagePromptLength: 42,
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-default-600">生成数</p>
          <div className="flex items-end gap-3">
            <span className="text-2xl font-semibold">{stats.images + stats.videos}</span>
            <div className="flex items-center gap-1 text-xs text-default-500">
              <Icon icon="lucide:image" className="text-primary" />
              <span>{stats.images}</span>
              <Icon icon="lucide:video" className="text-secondary ml-2" />
              <span>{stats.videos}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-default-600">コスト</p>
          <div className="flex items-end gap-1 justify-end">
            <span className="text-2xl font-semibold">${stats.totalCost.toFixed(2)}</span>
            <span className="text-xs text-default-500 mb-1">/ ${stats.quota.toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      <div>
        <div className="flex justify-between text-xs mb-1">
          <span className="text-default-600">利用量</span>
          <span className="text-default-500">{stats.usagePercentage}%</span>
        </div>
        <Progress value={stats.usagePercentage} color="primary" className="h-2" />
      </div>
      
      <div className="grid grid-cols-2 gap-4 pt-2">
        <div>
          <p className="text-xs text-default-500">よく使うモデル</p>
          <p className="text-sm font-medium truncate">{stats.mostUsedModel}</p>
        </div>
        <div>
          <p className="text-xs text-default-500">平均プロンプト長</p>
          <p className="text-sm font-medium">{stats.averagePromptLength} 文字</p>
        </div>
      </div>
    </div>
  );
};