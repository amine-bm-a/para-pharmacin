import { useEffect, useRef } from 'react';

/**
 * Supports physical (USB) barcode scanners — also known as "keyboard wedge"
 * devices. They type the barcode characters very fast then press Enter.
 *
 * Behaviour:
 *  - If the focus is inside a target input, the characters are left untouched
 *    (manual typing or scan into the field) and the Enter triggers the form.
 *  - If the focus is elsewhere, printable characters are captured into a buffer
 *    (preventing them from leaking into whatever control has focus) and the
 *    Enter flushes the buffer to `onScan`. A slow key repeat (manual typing)
 *    clears the buffer, so only genuine scans are detected.
 *
 * @param {function(string): void} onScan      Called with the scanned code.
 * @param {object}                 [options]
 * @param {string|null}            [options.targetSelector] CSS selector of the
 *                                  barcode input(s). When focus is inside it,
 *                                  characters are left untouched.
 * @param {number}                 [options.bufferTimeout=100] Max ms gap between
 *                                  keystrokes to still be considered one scan.
 */
export default function useBarcodeScanner(onScan, { targetSelector = null, bufferTimeout = 100 } = {}) {
  const bufferRef = useRef('');
  const timerRef = useRef(null);
  const onScanRef = useRef(onScan);
  onScanRef.current = onScan;

  const clearBuffer = () => {
    bufferRef.current = '';
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    const isTargetInput = (e) => {
      if (targetSelector) {
        return !!e.target.closest(targetSelector);
      }
      return (
        e.target.tagName === 'INPUT' ||
        e.target.tagName === 'TEXTAREA' ||
        e.target.isContentEditable
      );
    };

    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey || e.nativeEvent.isComposing) return;

      // Enter = end of a scan burst
      if (e.key === 'Enter') {
        if (bufferRef.current.length > 0) {
          e.preventDefault();
          const code = bufferRef.current;
          clearBuffer();
          onScanRef.current(code);
        }
        return;
      }

      // Only printable single characters are relevant
      if (e.key.length !== 1) return;

      // Focus is inside the target input → let it type naturally (manual or scan)
      if (isTargetInput(e)) return;

      // Focus is elsewhere → capture the scanner keystroke into the buffer
      e.preventDefault();
      bufferRef.current += e.key;

      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(clearBuffer, bufferTimeout);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [bufferTimeout, targetSelector]);

  return clearBuffer;
}