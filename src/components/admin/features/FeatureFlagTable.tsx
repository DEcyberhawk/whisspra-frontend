import React from 'react';
import { FeatureFlag } from '../../../pages/admin/FeaturesPage';

interface ToggleProps {
    enabled: boolean;
    onChange: () => void;
}

const Toggle: React.FC<ToggleProps> = ({ enabled, onChange }) => (
    <button
        type="button"
        onClick={onChange}
        className={`${enabled ? 'bg-indigo-600' : 'bg-slate-600'} relative inline-flex items-center h-6 rounded-full w-11 transition-colors`}
        aria-checked={enabled}
    >
        <span className={`${enabled ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full transition-transform`} />
    </button>
);

interface FeatureFlagTableProps {
    features: FeatureFlag[];
    onToggle: (featureId: string, isEnabled: boolean) => void;
}

const FeatureFlagTable: React.FC<FeatureFlagTableProps> = ({ features, onToggle }) => {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-300">
                        <tr>
                            <th scope="col" className="px-6 py-3">Feature</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3 text-right">Toggle</th>
                        </tr>
                    </thead>
                    <tbody>
                        {features.map(feature => (
                            <tr key={feature._id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700">
                                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                                    <div className="font-semibold">{feature.name}</div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400">{feature.description}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${feature.isEnabled ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-300'}`}>
                                        {feature.isEnabled ? 'Enabled' : 'Disabled'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <Toggle enabled={feature.isEnabled} onChange={() => onToggle(feature._id, !feature.isEnabled)} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FeatureFlagTable;
