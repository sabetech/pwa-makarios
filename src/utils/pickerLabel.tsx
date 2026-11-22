import React from 'react';

interface PickerOption {
    label: React.ReactNode;
    value: string;
}

/**
 * Render the selected label for an antd-mobile Picker.
 *
 * The Picker's render callback receives resolved option objects
 * ({ label, value }), not raw ids. Stringifying one of those yields
 * "[object Object]", so resolve the label from the option itself and
 * fall back to looking the id up in `options`.
 */
export const renderPickerLabel = (
    items: unknown[],
    options: PickerOption[] | undefined,
    placeholder: string,
): React.ReactNode => {
    const item = items?.[0] as any;

    if (item !== null && item !== undefined) {
        if (typeof item === 'object' && item.label !== undefined) {
            return item.label;
        }
        const id = String(typeof item === 'object' ? item.value : item);
        const match = options?.find(o => o.value === id);
        if (match) {
            return match.label;
        }
    }

    return <span style={{ color: '#94a3b8' }}>{placeholder}</span>;
};
