import React, { useState, useEffect, useRef, useMemo } from 'react';
import { FixedSizeList as List } from 'react-window';

// Виртуализированный список для больших данных
const VirtualizedList = ({ 
  items, 
  itemHeight = 200, 
  height = 400, 
  renderItem,
  className = '',
  ...props 
}) => {
  const [containerHeight, setContainerHeight] = useState(height);

  useEffect(() => {
    const updateHeight = () => {
      const availableHeight = window.innerHeight - 200; // Оставляем место для хедера
      setContainerHeight(Math.min(height, availableHeight));
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, [height]);

  const Row = useMemo(() => ({ index, style }) => (
    <div style={style}>
      {renderItem(items[index], index)}
    </div>
  ), [items, renderItem]);

  if (!items || items.length === 0) {
    return <div className={className}>Нет данных для отображения</div>;
  }

  return (
    <div className={className}>
      <List
        height={containerHeight}
        itemCount={items.length}
        itemSize={itemHeight}
        {...props}
      >
        {Row}
      </List>
    </div>
  );
};

export default VirtualizedList;
