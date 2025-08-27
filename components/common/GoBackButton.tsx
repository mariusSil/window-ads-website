'use client';

import Icon from '@/components/ui/Icon';

interface GoBackButtonProps {
  text: string;
}

export function GoBackButton({ text }: GoBackButtonProps) {
  const handleGoBack = () => {
    if (typeof window !== 'undefined') {
      window.history.back();
    }
  };

  return (
    <button
      onClick={handleGoBack}
      className="text-red-600 hover:text-red-700 underline transition-colors duration-200 inline-flex items-center"
    >
      <Icon name={"ArrowLeft" as any} className="w-4 h-4 mr-1" />
      {text}
    </button>
  );
}
