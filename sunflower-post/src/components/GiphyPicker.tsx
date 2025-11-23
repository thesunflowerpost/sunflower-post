"use client";

import { useState, useEffect } from "react";

interface GiphyPickerProps {
  onSelect: (gifUrl: string) => void;
  onClose: () => void;
}

interface GiphyGif {
  id: string;
  images: {
    fixed_height_small: {
      url: string;
    };
    original: {
      url: string;
    };
  };
  title: string;
}

// Demo API key - in production, users should provide their own
const GIPHY_API_KEY = "demo_api_key";
const GIPHY_ENDPOINT = "https://api.giphy.com/v1/gifs";

export default function GiphyPicker({ onSelect, onClose }: GiphyPickerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [gifs, setGifs] = useState<GiphyGif[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load trending GIFs on mount
    fetchTrending();
  }, []);

  async function fetchTrending() {
    setLoading(true);
    try {
      const response = await fetch(
        `${GIPHY_ENDPOINT}/trending?api_key=${GIPHY_API_KEY}&limit=20&rating=g`
      );
      const data = await response.json();
      setGifs(data.data || []);
    } catch (error) {
      console.error("Error fetching trending GIFs:", error);
    } finally {
      setLoading(false);
    }
  }

  async function searchGifs() {
    if (!searchTerm.trim()) {
      fetchTrending();
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${GIPHY_ENDPOINT}/search?api_key=${GIPHY_API_KEY}&q=${encodeURIComponent(
          searchTerm
        )}&limit=20&rating=g`
      );
      const data = await response.json();
      setGifs(data.data || []);
    } catch (error) {
      console.error("Error searching GIFs:", error);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      searchGifs();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl max-h-[80vh] bg-white rounded-xl shadow-[var(--shadow-large)] overflow-hidden flex flex-col border border-[color:var(--border-medium)]">
        {/* Header */}
        <div className="p-4 border-b border-[color:var(--border-medium)] bg-white">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-[color:var(--text-primary)]">
              Add a GIF
            </h3>
            <button
              onClick={onClose}
              className="text-[color:var(--text-tertiary)] hover:text-[color:var(--text-primary)] transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Search */}
          <div className="flex gap-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search for GIFs..."
              className="flex-1 border border-[color:var(--border-medium)] rounded-lg px-4 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[color:var(--sunflower-gold)] transition-all"
              autoFocus
            />
            <button
              onClick={searchGifs}
              className="px-4 py-2 rounded-lg bg-[color:var(--sunflower-gold)] hover:bg-[color:var(--honey-gold)] text-[color:var(--text-primary)] text-sm font-semibold shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-medium)] transition-all"
            >
              Search
            </button>
          </div>
        </div>

        {/* GIF Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-[color:var(--text-tertiary)]">Loading...</p>
            </div>
          ) : gifs.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-[color:var(--text-tertiary)]">No GIFs found</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {gifs.map((gif) => (
                <button
                  key={gif.id}
                  onClick={() => onSelect(gif.images.original.url)}
                  className="aspect-square rounded-lg overflow-hidden border border-[color:var(--border-medium)] hover:ring-4 hover:ring-[color:var(--sunflower-gold)] transition-all hover:scale-105 active:scale-95 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-medium)]"
                >
                  <img
                    src={gif.images.fixed_height_small.url}
                    alt={gif.title}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[color:var(--border-soft)] bg-white">
          <p className="text-[10px] text-[color:var(--text-tertiary)] text-center">
            Powered by GIPHY · Keep it gentle and kind
          </p>
        </div>
      </div>
    </div>
  );
}
