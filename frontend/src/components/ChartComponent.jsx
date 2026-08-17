import React, { useRef, useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ChartComponent = ({ historyData, symbol, isLight = false }) => {
  const chartRef = useRef(null);
  const [showEMA, setShowEMA] = useState(false);
  const [showSMA, setShowSMA] = useState(false);

  // No chart data exist
  if (!historyData || historyData.length === 0) {
    return (
      <div style={{
        height: '350px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: isLight ? '#f8fafc' : 'var(--bg-card-40)',
        border: `1px solid ${isLight ? '#e2e8f0' : 'var(--glass-border)'}`,
        borderRadius: '12px',
        color: isLight ? '#64748b' : 'var(--color-text-muted)',
        fontFamily: 'Outfit, sans-serif'
      }}>
        No historical price data found
      </div>
    );
  }

  // Extract dates and prices
  const labels = historyData.map(candle => candle.date);
  const closePrices = historyData.map(candle => candle.close);

  // Helper functions for indicators
  const calculateSMA = (data, period) => {
    let sma = [];
    for (let i = 0; i < data.length; i++) {
      if (i < period - 1) {
        sma.push(null); // Not enough data
      } else {
        const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
        sma.push(Number((sum / period).toFixed(2)));
      }
    }
    return sma;
  };

  const calculateEMA = (data, period) => {
    let ema = [];
    if (data.length === 0) return ema;

    const k = 2 / (period + 1);
    let emaVal = data[0]; // Start with first close

    for (let i = 0; i < data.length; i++) {
      if (i < period - 1) {
        ema.push(null);
      } else if (i === period - 1) {
        // SMA for initial seed
        const sum = data.slice(0, period).reduce((a, b) => a + b, 0);
        emaVal = sum / period;
        ema.push(Number(emaVal.toFixed(2)));
      } else {
        emaVal = data[i] * k + emaVal * (1 - k);
        ema.push(Number(emaVal.toFixed(2)));
      }
    }
    return ema;
  };

  const ema20Data = calculateEMA(closePrices, 20);
  const sma50Data = calculateSMA(closePrices, 50);

  // Configure Chart JS data
  const data = {
    labels,
    datasets: [
      {
        label: `${symbol} Price`,
        data: closePrices,
        borderColor: isLight ? '#2563eb' : '#3b82f6',
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: isLight ? '#2563eb' : '#3b82f6',
        pointHoverBorderColor: '#FFF',
        pointHoverBorderWidth: 2,
        tension: 0.1,
        fill: true,
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return null;
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, isLight ? 'rgba(37, 99, 235, 0.15)' : 'rgba(59, 130, 246, 0.15)');
          gradient.addColorStop(1, isLight ? 'rgba(255, 255, 255, 0.0)' : 'rgba(17, 24, 39, 0.0)');
          return gradient;
        },
      },
      showEMA && {
        label: 'EMA (20)',
        data: ema20Data,
        borderColor: isLight ? '#d97706' : '#10b981',
        borderWidth: 1.5,
        borderDash: [5, 5],
        pointRadius: 0,
        tension: 0.1,
        fill: false,
      },
      showSMA && {
        label: 'SMA (50)',
        data: sma50Data,
        borderColor: isLight ? '#dc2626' : '#ef4444',
        borderWidth: 1.5,
        pointRadius: 0,
        tension: 0.1,
        fill: false,
      }
    ].filter(Boolean)
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: isLight ? '#1e293b' : '#94a3b8',
          font: {
            family: 'Outfit, sans-serif',
            size: 12
          },
          usePointStyle: true,
          boxWidth: 6
        }
      },
      tooltip: {
        backgroundColor: isLight ? '#0f172a' : '#111827',
        titleColor: isLight ? '#3b82f6' : '#3b82f6',
        titleFont: {
          family: 'Outfit, sans-serif',
          size: 12
        },
        bodyColor: '#ffffff',
        bodyFont: {
          family: 'Outfit, sans-serif',
          size: 13,
          weight: 'bold'
        },
        borderColor: isLight ? '#1e293b' : 'rgba(148, 163, 184, 0.12)',
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        callbacks: {
          label: (context) => ` ₹ ${context.parsed.y.toLocaleString('en-IN')}`
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: isLight ? '#f1f5f9' : 'rgba(148, 163, 184, 0.12)',
          borderColor: isLight ? '#e2e8f0' : 'rgba(148, 163, 184, 0.12)'
        },
        ticks: {
          color: isLight ? '#64748b' : '#94a3b8',
          font: {
            family: 'Inter, sans-serif',
            size: 10
          },
          maxRotation: 45,
          maxTicksLimit: 10
        }
      },
      y: {
        grid: {
          color: isLight ? '#f1f5f9' : 'rgba(148, 163, 184, 0.12)',
          borderColor: isLight ? '#e2e8f0' : 'rgba(148, 163, 184, 0.12)'
        },
        ticks: {
          color: isLight ? '#64748b' : '#94a3b8',
          font: {
            family: 'Inter, sans-serif',
            size: 10
          },
          callback: (value) => `₹${value.toLocaleString('en-IN')}`
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index',
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      {/* Overlay Toggles */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
        <button
          onClick={() => setShowEMA(!showEMA)}
          style={{
            background: showEMA
              ? (isLight ? '#fef3c7' : 'var(--color-primary-20)')
              : (isLight ? '#f8fafc' : 'var(--bg-card-40)'),
            border: `1px solid ${showEMA
              ? (isLight ? '#d97706' : 'var(--color-primary)')
              : (isLight ? '#e2e8f0' : 'var(--glass-border)')}`,
            color: showEMA
              ? (isLight ? '#b45309' : 'var(--color-white)')
              : (isLight ? '#64748b' : 'var(--color-text-muted)'),
            padding: '5px 12px',
            borderRadius: '6px',
            fontSize: '11px',
            fontFamily: 'Outfit, sans-serif',
            cursor: 'pointer',
            transition: 'all 0.3s'
          }}
        >
          EMA (20): {showEMA ? 'On' : 'Off'}
        </button>
        <button
          onClick={() => setShowSMA(!showSMA)}
          style={{
            background: showSMA
              ? (isLight ? '#fee2e2' : 'var(--color-bearish-20)')
              : (isLight ? '#f8fafc' : 'var(--bg-card-40)'),
            border: `1px solid ${showSMA
              ? (isLight ? '#dc2626' : 'var(--color-coral)')
              : (isLight ? '#e2e8f0' : 'var(--glass-border)')}`,
            color: showSMA
              ? (isLight ? '#b91c1c' : 'var(--color-white)')
              : (isLight ? '#64748b' : 'var(--color-text-muted)'),
            padding: '5px 12px',
            borderRadius: '6px',
            fontSize: '11px',
            fontFamily: 'Outfit, sans-serif',
            cursor: 'pointer',
            transition: 'all 0.3s'
          }}
        >
          SMA (50): {showSMA ? 'On' : 'Off'}
        </button>
      </div>

      {/* Chart Canvas */}
      <div style={{ height: '350px', position: 'relative' }}>
        <Line ref={chartRef} data={data} options={options} />
      </div>
    </div>
  );
};

export default ChartComponent;
