'use client';

import React from 'react';

interface DataCardProps<T> {
  item: T;
  title: (item: T) => React.ReactNode;
  subtitle?: (item: T) => React.ReactNode;
  meta?: (item: T) => React.ReactNode;
  footer?: (item: T) => React.ReactNode;
  statusIndicator?: (item: T) => { color: string; label?: string };
  onClick?: (item: T) => void;
}

export default function DataCard<T>({
  item,
  title,
  subtitle,
  meta,
  footer,
  statusIndicator,
  onClick,
}: DataCardProps<T>) {
  return (
    <div
      onClick={() => onClick?.(item)}
      className={`bg-card text-card-foreground p-6 rounded-lg border border-default shadow-sm transition-shadow ${
        onClick ? 'hover:shadow-md cursor-pointer' : ''
      }`}
    >
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <div className="font-semibold text-lg">{title(item)}</div>
          {subtitle && (
            <div className="text-muted-foreground text-sm">
              {subtitle(item)}
            </div>
          )}
          {meta && <div className="text-sm">{meta(item)}</div>}
        </div>
        {statusIndicator && (
          <div className="flex items-center space-x-2">
            <div
              className={`w-2 h-2 rounded-full ${
                statusIndicator(item).color
              }`}
            />
            {statusIndicator(item).label && (
              <span className="text-xs text-muted-foreground">
                {statusIndicator(item).label}
              </span>
            )}
          </div>
        )}
      </div>
      {footer && (
        <div className="mt-4 pt-4 border-t border-border">
          {footer(item)}
        </div>
      )}
    </div>
  );
}