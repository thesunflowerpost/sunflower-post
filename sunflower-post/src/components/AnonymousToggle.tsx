"use client";

/**
 * AnonymousToggle Component
 *
 * A reusable toggle for anonymous posting that shows the user's alias
 */

interface AnonymousToggleProps {
  isAnonymous: boolean;
  onChange: (isAnonymous: boolean) => void;
  userAlias?: string;
  className?: string;
}

export default function AnonymousToggle({
  isAnonymous,
  onChange,
  userAlias,
  className = "",
}: AnonymousToggleProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="inline-flex items-center gap-2 text-[11px] text-[#7A674C] cursor-pointer">
        <input
          type="checkbox"
          checked={isAnonymous}
          onChange={(e) => onChange(e.target.checked)}
          className="rounded border-yellow-300 text-yellow-500 focus:ring-yellow-300 cursor-pointer"
        />
        <span>Post anonymously</span>
      </label>

      {isAnonymous && userAlias && (
        <div className="ml-5 text-[10px] text-[#A08960] bg-yellow-50 border border-yellow-100 rounded-lg px-2 py-1 inline-block">
          <span className="font-medium">You'll appear as:</span>{" "}
          <span className="text-[#5C4A33]">{userAlias}</span>
        </div>
      )}
    </div>
  );
}
