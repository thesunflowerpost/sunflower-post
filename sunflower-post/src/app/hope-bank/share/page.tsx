"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import CommunitySidebar from "@/components/CommunitySidebar";
import Link from "next/link";
import { BouncyButton } from "@/components/ui";
import Image from "next/image";

type Category = "Career" | "Health" | "Family" | "Money" | "Faith" | "Other";

export default function ShareHopeStoryPage() {
  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    fullStory: "",
    category: "Other" as Category,
    turningPoint: "",
    author: "",
    isAnon: false,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  function handleInputChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  function handleRemoveImage() {
    setImageFile(null);
    setImagePreview(null);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log("Hope story submitted:", {
      ...formData,
      imageFile: imageFile?.name,
    });

    setIsSubmitting(false);
    setShowSuccess(true);

    // Reset form after 2 seconds
    setTimeout(() => {
      setFormData({
        title: "",
        summary: "",
        fullStory: "",
        category: "Other",
        turningPoint: "",
        author: "",
        isAnon: false,
      });
      setImageFile(null);
      setImagePreview(null);
      setShowSuccess(false);
    }, 2000);
  }

  const categories: Category[] = [
    "Career",
    "Health",
    "Family",
    "Money",
    "Faith",
    "Other",
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-10">
      <div className="grid md:grid-cols-4 gap-6 items-start">
        {/* LEFT: ROOMS SIDEBAR */}
        <div className="md:col-span-1">
          <CommunitySidebar />
        </div>

        {/* RIGHT: SUBMISSION FORM */}
        <div className="md:col-span-3 space-y-6">
          {/* BREADCRUMB */}
          <div className="flex items-center text-[11px] text-[#7A674C]">
            <Link
              href="/hope-bank"
              className="inline-flex items-center gap-1 hover:text-yellow-900"
            >
              <span>←</span>
              <span>Back to Hope Bank</span>
            </Link>
          </div>

          {/* HEADER */}
          <section className="bg-gradient-to-br from-white to-yellow-50/30 border border-yellow-200/60 rounded-2xl p-4 md:p-5 space-y-2 shadow-md">
            <h1 className="text-lg md:text-xl font-bold text-yellow-900">
              Share a hope story 🌻
            </h1>
            <p className="text-xs md:text-sm text-[#5C4A33] leading-relaxed">
              Your story doesn&apos;t need to be dramatic or perfectly resolved.
              If it helped you keep going, it might help someone else too.
            </p>
          </section>

          {/* SUBMISSION GUIDELINES */}
          <section className="bg-white border border-yellow-200/60 rounded-2xl p-4 md:p-5 space-y-3 text-xs shadow-sm">
            <h2 className="font-semibold text-yellow-900">
              What makes a good Hope Bank story?
            </h2>
            <ul className="space-y-2 text-[#5C4A33] list-disc list-inside">
              <li>
                <strong>Honest over hopeful:</strong> We want the messy middle,
                not the movie ending.
              </li>
              <li>
                <strong>Specific moments:</strong> What actually shifted? What
                did someone say? What tiny thing helped?
              </li>
              <li>
                <strong>Still-in-progress is welcome:</strong> You don&apos;t
                need to have &quot;made it&quot; to share.
              </li>
              <li>
                <strong>No advice-giving:</strong> This isn&apos;t about telling
                people what to do—just what happened for you.
              </li>
            </ul>
          </section>

          {/* SUBMISSION FORM */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* TITLE */}
            <section className="bg-white border border-yellow-200/60 rounded-2xl p-4 md:p-5 space-y-3 text-xs shadow-sm">
              <label className="block">
                <span className="font-semibold text-yellow-900 mb-2 block">
                  Story title
                </span>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  placeholder='e.g. "I got rejected from 12 roles… and then landed the one that actually fit"'
                  className="w-full border border-yellow-200 rounded-xl px-3 py-2 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-yellow-300/50 focus:border-yellow-300 transition-all"
                />
                <p className="text-[10px] text-[#A08960] mt-2">
                  Keep it conversational and human. Think: what would you say to
                  a friend?
                </p>
              </label>
            </section>

            {/* CATEGORY & AUTHOR */}
            <section className="bg-white border border-yellow-200/60 rounded-2xl p-4 md:p-5 space-y-4 text-xs shadow-sm">
              <div className="grid md:grid-cols-2 gap-4">
                <label className="block">
                  <span className="font-semibold text-yellow-900 mb-2 block">
                    Category
                  </span>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full border border-yellow-200 rounded-xl px-3 py-2 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-yellow-300/50 focus:border-yellow-300 transition-all"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="font-semibold text-yellow-900 mb-2 block">
                    Your name (or initials)
                  </span>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    required={!formData.isAnon}
                    disabled={formData.isAnon}
                    placeholder='e.g. "Sarah" or "S."'
                    className="w-full border border-yellow-200 rounded-xl px-3 py-2 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-yellow-300/50 focus:border-yellow-300 transition-all disabled:bg-gray-50 disabled:text-gray-400"
                  />
                </label>
              </div>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isAnon"
                  checked={formData.isAnon}
                  onChange={handleInputChange}
                  className="rounded border-yellow-300 text-yellow-600 focus:ring-yellow-300/50"
                />
                <span className="text-[#5C4A33]">
                  Post this anonymously (your story will still be linked to your account)
                </span>
              </label>
            </section>

            {/* SUMMARY */}
            <section className="bg-white border border-yellow-200/60 rounded-2xl p-4 md:p-5 space-y-3 text-xs shadow-sm">
              <label className="block">
                <span className="font-semibold text-yellow-900 mb-2 block">
                  One-sentence summary
                </span>
                <input
                  type="text"
                  name="summary"
                  value={formData.summary}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. &quot;I was convinced I'd missed my moment. The role I finally got didn't even exist when I started applying.&quot;"
                  className="w-full border border-yellow-200 rounded-xl px-3 py-2 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-yellow-300/50 focus:border-yellow-300 transition-all"
                />
                <p className="text-[10px] text-[#A08960] mt-2">
                  This appears on the Hope Bank main page. Make it intriguing
                  but honest.
                </p>
              </label>
            </section>

            {/* TURNING POINT */}
            <section className="bg-white border border-yellow-200/60 rounded-2xl p-4 md:p-5 space-y-3 text-xs shadow-sm">
              <label className="block">
                <span className="font-semibold text-yellow-900 mb-2 block">
                  What was the turning point?
                </span>
                <input
                  type="text"
                  name="turningPoint"
                  value={formData.turningPoint}
                  onChange={handleInputChange}
                  required
                  placeholder='e.g. "A friend made me apply for a role I felt underqualified for."'
                  className="w-full border border-yellow-200 rounded-xl px-3 py-2 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-yellow-300/50 focus:border-yellow-300 transition-all"
                />
                <p className="text-[10px] text-[#A08960] mt-2">
                  What small moment or decision helped things shift? It
                  doesn&apos;t have to be huge.
                </p>
              </label>
            </section>

            {/* FULL STORY */}
            <section className="bg-white border border-yellow-200/60 rounded-2xl p-4 md:p-5 space-y-3 text-xs shadow-sm">
              <label className="block">
                <span className="font-semibold text-yellow-900 mb-2 block">
                  Your full story
                </span>
                <textarea
                  name="fullStory"
                  value={formData.fullStory}
                  onChange={handleInputChange}
                  required
                  rows={10}
                  placeholder="Tell us what happened. You can include:&#10;• What it felt like when things were hard&#10;• The moment something shifted (even slightly)&#10;• Where you are now (even if it's still in progress)&#10;&#10;Write like you're texting a friend. Paragraphs are fine. Typos are fine. Honesty > polish."
                  className="w-full border border-yellow-200 rounded-xl px-3 py-2 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-yellow-300/50 focus:border-yellow-300 transition-all resize-y"
                />
                <div className="flex items-center justify-between mt-2">
                  <p className="text-[10px] text-[#A08960]">
                    Aim for 150-300 words. Longer is okay if needed.
                  </p>
                  <p className="text-[10px] text-[#7A674C]">
                    {formData.fullStory.split(/\s+/).filter(Boolean).length}{" "}
                    words
                  </p>
                </div>
              </label>
            </section>

            {/* IMAGE UPLOAD */}
            <section className="bg-white border border-yellow-200/60 rounded-2xl p-4 md:p-5 space-y-3 text-xs shadow-sm">
              <div className="space-y-3">
                <label className="block">
                  <span className="font-semibold text-yellow-900 mb-2 block">
                    Add an image (optional)
                  </span>
                  <p className="text-[10px] text-[#A08960] mb-3">
                    You can share a photo that represents your story—a place, a
                    moment, or just something that feels right.
                  </p>

                  {!imagePreview ? (
                    <div className="border-2 border-dashed border-yellow-200 rounded-xl p-6 text-center hover:border-yellow-300 transition-all cursor-pointer bg-yellow-50/30">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className="cursor-pointer block"
                      >
                        <div className="text-4xl mb-2">📸</div>
                        <p className="text-xs text-[#5C4A33] font-medium mb-1">
                          Click to upload an image
                        </p>
                        <p className="text-[10px] text-[#A08960]">
                          JPG, PNG, or GIF (max 5MB)
                        </p>
                      </label>
                    </div>
                  ) : (
                    <div className="relative border border-yellow-200 rounded-xl overflow-hidden">
                      <Image
                        src={imagePreview}
                        alt="Story preview"
                        width={600}
                        height={400}
                        className="w-full h-auto object-cover max-h-96"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 bg-white/90 hover:bg-white border border-yellow-200 rounded-full px-3 py-1.5 text-[10px] font-medium text-[#5C4A33] shadow-md transition-all"
                      >
                        Remove image
                      </button>
                    </div>
                  )}
                </label>
              </div>
            </section>

            {/* SUBMIT */}
            <section className="bg-gradient-to-br from-white to-yellow-50/30 border border-yellow-200/60 rounded-2xl p-4 md:p-5 space-y-3 text-xs shadow-md">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <p className="font-semibold text-yellow-900 mb-1">
                    Ready to share?
                  </p>
                  <p className="text-[10px] text-[#7A674C]">
                    Your story will be published immediately to Hope Bank. If flagged by the community, we'll review it.
                  </p>
                </div>
                <BouncyButton
                  type="submit"
                  disabled={isSubmitting || showSuccess}
                  variant="primary"
                  size="sm"
                  className="shadow-md whitespace-nowrap"
                >
                  {isSubmitting
                    ? "Publishing..."
                    : showSuccess
                      ? "✓ Published!"
                      : "Publish story"}
                </BouncyButton>
              </div>

              {showSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-green-800">
                  <p className="font-semibold mb-1">
                    Your story is now live! 🌻
                  </p>
                  <p className="text-[10px]">
                    Thank you for sharing hope with the community.
                  </p>
                </div>
              )}
            </section>
          </form>
        </div>
      </div>
    </div>
  );
}
