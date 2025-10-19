// Finite difference differentiation utilities
// Supports: First/Second derivative, Forward/Backward/Centered stencils
// Error orders: O(h), O(h^2), O(h^4) where applicable

// Evaluate function safely at x using provided JS function f(x)
export function evalF(f, x) {
  try {
    const y = f(x);
    return Number.isFinite(y) ? y : NaN;
  } catch {
    return NaN;
  }
}

// Build derivative numerical approximations
// order: 1 | 2
// direction: 'forward' | 'backward' | 'centered'
// accuracy: 'O(h)' | 'O(h^2)' | 'O(h^4)'
export function differentiate(f, x, h, order, direction, accuracy) {
  try {
    const o = String(order).trim();
    const dir = String(direction).toLowerCase();
    const acc = String(accuracy).replace(/\s+/g, '');
    if (!(h > 0)) throw new Error('h must be > 0');
    const F = (t) => evalF(f, t);
    const fx = F(x);

  if (o === '1' || /first/i.test(o)) {
    // First derivative
    if (dir === 'forward') {
      if (acc === 'O(h)' || /O\(h\)/i.test(accuracy)) {
        // f'(x) ≈ (f(x+h) - f(x))/h
        return (F(x + h) - fx) / h;
      }
      if (acc === 'O(h^2)' || /O\(h\^2\)/i.test(accuracy)) {
        // f'(x) ≈ (-3f(x) + 4f(x+h) - f(x+2h)) / (2h)
        return (-3 * fx + 4 * F(x + h) - F(x + 2 * h)) / (2 * h);
      }
      // O(h^4) forward 5-point one-sided
      if (acc === 'O(h^4)' || /O\(h\^4\)/i.test(accuracy)) {
        // f'(x) ≈ (-25 f(x) + 48 f(x+h) - 36 f(x+2h) + 16 f(x+3h) - 3 f(x+4h)) / (12 h)
        return (
          -25 * fx +
          48 * F(x + h) -
          36 * F(x + 2 * h) +
          16 * F(x + 3 * h) -
          3 * F(x + 4 * h)
        ) / (12 * h);
      }
    }
    if (dir === 'backward') {
      if (acc === 'O(h)' || /O\(h\)/i.test(accuracy)) {
        // f'(x) ≈ (f(x) - f(x-h))/h
        return (fx - F(x - h)) / h;
      }
      if (acc === 'O(h^2)' || /O\(h\^2\)/i.test(accuracy)) {
        // f'(x) ≈ (3f(x) - 4f(x-h) + f(x-2h)) / (2h)
        return (3 * fx - 4 * F(x - h) + F(x - 2 * h)) / (2 * h);
      }
      if (acc === 'O(h^4)' || /O\(h\^4\)/i.test(accuracy)) {
        // f'(x) ≈ (25 f(x) - 48 f(x-h) + 36 f(x-2h) - 16 f(x-3h) + 3 f(x-4h)) / (12 h)
        return (
          25 * fx -
          48 * F(x - h) +
          36 * F(x - 2 * h) -
          16 * F(x - 3 * h) +
          3 * F(x - 4 * h)
        ) / (12 * h);
      }
    }
    if (dir === 'centered' || dir === 'centred') {
      if (acc === 'O(h^2)' || /O\(h\^2\)/i.test(accuracy) || acc === 'O(h)') {
        // Note: standard centered first derivative is O(h^2)
        // f'(x) ≈ (f(x+h) - f(x-h)) / (2h)
        return (F(x + h) - F(x - h)) / (2 * h);
      }
      if (acc === 'O(h^4)' || /O\(h\^4\)/i.test(accuracy)) {
        // 5-point stencil O(h^4)
        // f'(x) ≈ ( -f(x+2h) + 8 f(x+h) - 8 f(x-h) + f(x-2h) ) / (12 h)
        return (
          -F(x + 2 * h) + 8 * F(x + h) - 8 * F(x - h) + F(x - 2 * h)
        ) / (12 * h);
      }
    }
  }
  if (o === '2' || /second/i.test(o)) {
    // Second derivative
    if (dir === 'forward') {
      if (acc === 'O(h)' || /O\(h\)/i.test(accuracy)) {
        // f''(x) ≈ (f(x+2h) - 2 f(x+h) + f(x)) / h^2  [O(h)]
        return (F(x + 2 * h) - 2 * F(x + h) + fx) / (h * h);
      }
      if (acc === 'O(h^2)' || /O\(h\^2\)/i.test(accuracy)) {
        // f''(x) ≈ (2f(x) -5f(x+h) +4f(x+2h) - f(x+3h)) / h^2
        return (2 * fx - 5 * F(x + h) + 4 * F(x + 2 * h) - F(x + 3 * h)) / (h * h);
      }
    }
    if (dir === 'backward') {
      if (acc === 'O(h)' || /O\(h\)/i.test(accuracy)) {
        // f''(x) ≈ (f(x) - 2 f(x-h) + f(x-2h)) / h^2 [O(h)]
        return (fx - 2 * F(x - h) + F(x - 2 * h)) / (h * h);
      }
      if (acc === 'O(h^2)' || /O\(h\^2\)/i.test(accuracy)) {
        // f''(x) ≈ (2f(x) - 5f(x-h) + 4f(x-2h) - f(x-3h)) / h^2
        return (2 * fx - 5 * F(x - h) + 4 * F(x - 2 * h) - F(x - 3 * h)) / (h * h);
      }
    }
    if (dir === 'centered' || dir === 'centred') {
      if (acc === 'O(h^2)' || /O\(h\^2\)/i.test(accuracy) || acc === 'O(h)') {
        // f''(x) ≈ (f(x+h) - 2 f(x) + f(x-h)) / h^2 [O(h^2)]
        return (F(x + h) - 2 * fx + F(x - h)) / (h * h);
      }
      if (acc === 'O(h^4)' || /O\(h\^4\)/i.test(accuracy)) {
        // 5-point O(h^4) formula
        // f''(x) ≈ (-f(x+2h) + 16 f(x+h) - 30 f(x) + 16 f(x-h) - f(x-2h)) / (12 h^2)
        return (
          -F(x + 2 * h) + 16 * F(x + h) - 30 * fx + 16 * F(x - h) - F(x - 2 * h)
        ) / (12 * h * h);
      }
    }
  }
  throw new Error('Unsupported combination of order/direction/accuracy');
  } catch (e) { return { error: String(e) }; }
}
