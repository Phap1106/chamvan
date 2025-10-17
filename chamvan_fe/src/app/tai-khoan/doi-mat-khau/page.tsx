'use client';

import { useState } from 'react';
import AccountLayout from '../_components/AccountLayout';

function PasswordInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const [show, setShow] = useState(false);

  return (
    <label className="block">
      <span className="block mb-2 text-sm font-medium text-gray-700">{label}</span>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 text-sm bg-white border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-gray-300"
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute text-gray-600 -translate-y-1/2 right-3 top-1/2"
          aria-label="Toggle password"
        >
          {show ? '🙈' : '👁️'}
        </button>
      </div>
    </label>
  );
}

export default function ChangePasswordPage() {
  const [cur, setCur] = useState('');
  const [n1, setN1] = useState('');
  const [n2, setN2] = useState('');

  const strength =
    n1.length >= 10 ? 'Mạnh'
      : n1.length >= 6 ? 'Trung bình'
      : n1.length > 0 ? 'Yếu'
      : 'Không mật khẩu';

  return (
    <AccountLayout title="Thay đổi mật khẩu">
      <form
        onSubmit={(e) => e.preventDefault()}
        className="p-5 space-y-5 bg-white border border-gray-200 rounded-lg"
      >
        <PasswordInput label="Mật khẩu hiện tại *" value={cur} onChange={setCur} />
        <div>
          <PasswordInput label="Mật khẩu mới *" value={n1} onChange={setN1} />
          <p className="mt-1 text-xs text-gray-500">Mật khẩu mạnh: {strength}</p>
        </div>
        <PasswordInput label="Xác nhận Mật khẩu mới *" value={n2} onChange={setN2} />

        <button
          type="submit"
          className="inline-flex items-center px-6 py-3 mt-2 text-sm font-medium text-white bg-black rounded hover:opacity-90"
        >
          LƯU
        </button>
      </form>
    </AccountLayout>
  );
}
