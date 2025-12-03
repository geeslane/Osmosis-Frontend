'use client';

import { ChangeEvent } from 'react';

export default function UploadComponent() {
    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('http://localhost:8000/api/upload-file', {
            method: 'POST',
            body: formData,
        });

        const data = await res.json();
        console.log(data);
    };

    return (
        <div className="space-y-4">
            <input name="file" type="file" onChange={handleFileChange} />
        </div>
    );
}
