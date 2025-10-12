import React from 'react';
import { Rate, Typography } from 'antd';

const { Text } = Typography;

export default function RatingDisplay({ 
  rating, 
  showText = true, 
  size = 'default',
  style = {},
  showCount = false,
  totalReviews = 0
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', ...style }}>
      <Rate 
        disabled 
        value={rating} 
        size={size}
        style={{ color: '#faad14' }}
      />
      {showText && (
        <Text style={{ fontSize: '14px', color: '#666' }}>
          {rating.toFixed(1)}
        </Text>
      )}
      {showCount && (
        <Text style={{ fontSize: '12px', color: '#999' }}>
          ({totalReviews})
        </Text>
      )}
    </div>
  );
}
