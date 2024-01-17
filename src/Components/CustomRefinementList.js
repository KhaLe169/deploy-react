import React from 'react';
import { useRefinementList } from 'react-instantsearch';

export default function CustomRefinementList(props) {
     
    const { items, refine } = useRefinementList({ attribute: 'category', operator: 'and' });

    const handleItemClick = (value) => {
        props.setFilter(value)
        refine(value);
    };
    return (
        <>
            {items.map((item) => (
                <div key={item.value} className="flex items-center">
                    <input
                        defaultValue={item.value}
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        onChange={() => handleItemClick(item.value)}
                    />
                    <label
                        className="ml-3 text-sm text-gray-600"
                    >
                        {item.label}
                    </label>
                </div>
            ))}
        </>
    );
}