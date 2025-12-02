"use client";

import { useState } from 'react';
import type { UserLists, ListItem } from '@/types/profile';

type ListsTabProps = {
  lists: UserLists;
  isOwnProfile: boolean;
  onUpdate?: () => void; // Callback to reload data
};

type ListType = 'read' | 'watch' | 'listen';

// Get status emoji
function getStatusEmoji(status: ListItem['status']): string {
  if (status.includes('Reading') || status.includes('Watching') || status.includes('Listening')) {
    return '▶️';
  }
  if (status.includes('Finished') || status.includes('Watched') || status.includes('Listened')) {
    return '✅';
  }
  return '📌';
}

// Get status color
function getStatusColor(status: ListItem['status']): string {
  if (status.includes('Reading') || status.includes('Watching') || status.includes('Listening')) {
    return 'bg-blue-100 text-blue-800 border-blue-200';
  }
  if (status.includes('Finished') || status.includes('Watched') || status.includes('Listened')) {
    return 'bg-green-100 text-green-800 border-green-200';
  }
  return 'bg-yellow-100 text-yellow-800 border-yellow-200';
}

export default function ListsTab({ lists, isOwnProfile, onUpdate }: ListsTabProps) {
  const [activeList, setActiveList] = useState<ListType>('read');
  const [editingItem, setEditingItem] = useState<ListItem | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Edit form state
  const [editForm, setEditForm] = useState({
    status: '',
    rating: 0,
    note: '',
  });

  const currentList = activeList === 'read'
    ? lists.readList
    : activeList === 'watch'
    ? lists.watchList
    : lists.listenList;

  const listLabels = {
    read: 'Read List',
    watch: 'Watch List',
    listen: 'Listening List',
  };

  const listIcons = {
    read: '📚',
    watch: '📺',
    listen: '🎵',
  };

  // Get appropriate statuses for each list type
  const getStatusOptions = (listType: ListType): ListItem['status'][] => {
    if (listType === 'read') {
      return ['To read', 'Reading', 'Finished'];
    } else if (listType === 'watch') {
      return ['Want to watch', 'Watching', 'Watched'];
    } else {
      return ['Listening', 'Listened'];
    }
  };

  function handleEditClick(item: ListItem) {
    setEditingItem(item);
    setEditForm({
      status: item.status,
      rating: item.rating || 0,
      note: item.note || '',
    });
    setShowEditModal(true);
  }

  async function handleSaveEdit() {
    if (!editingItem) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/user-lists/${editingItem.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      });

      if (!response.ok) {
        throw new Error('Failed to update item');
      }

      // Close modal and reload data
      setShowEditModal(false);
      setEditingItem(null);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Failed to update list item:', error);
      alert('Failed to update item. Please try again.');
    }
  }

  async function handleRemove(itemId: string) {
    if (!confirm('Are you sure you want to remove this item from your list?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/user-lists/${itemId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to remove item');
      }

      // Reload data
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Failed to remove list item:', error);
      alert('Failed to remove item. Please try again.');
    }
  }

  if (currentList.length === 0) {
    return (
      <div className="space-y-4">
        {/* List Tabs */}
        <div className="flex gap-2 border-b border-yellow-200/60">
          {(Object.keys(listLabels) as ListType[]).map((list) => (
            <button
              key={list}
              onClick={() => setActiveList(list)}
              className={`px-4 py-2 text-sm font-semibold whitespace-nowrap transition-all ${
                activeList === list
                  ? 'text-yellow-900 border-b-2 border-yellow-500'
                  : 'text-[#A08960] hover:text-[#7A674C] hover:bg-yellow-50/50'
              }`}
            >
              {listIcons[list]} {listLabels[list]}
            </button>
          ))}
        </div>

        {/* Empty State */}
        <div className="text-center py-12 space-y-2">
          <p className="text-3xl">{listIcons[activeList]}</p>
          <p className="text-[#A08960] text-sm">
            {isOwnProfile
              ? `Your ${listLabels[activeList].toLowerCase()} is empty.`
              : `No items in ${listLabels[activeList].toLowerCase()} yet.`}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* List Tabs */}
      <div className="flex gap-2 border-b border-yellow-200/60">
        {(Object.keys(listLabels) as ListType[]).map((list) => {
          const count = list === 'read'
            ? lists.readList.length
            : list === 'watch'
            ? lists.watchList.length
            : lists.listenList.length;

          return (
            <button
              key={list}
              onClick={() => setActiveList(list)}
              className={`px-4 py-2 text-sm font-semibold whitespace-nowrap transition-all ${
                activeList === list
                  ? 'text-yellow-900 border-b-2 border-yellow-500'
                  : 'text-[#A08960] hover:text-[#7A674C] hover:bg-yellow-50/50'
              }`}
            >
              {listIcons[list]} {listLabels[list]} ({count})
            </button>
          );
        })}
      </div>

      {/* List Items Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentList.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-yellow-200/60 rounded-2xl p-4 hover:border-yellow-300 hover:shadow-md transition-all group"
          >
            {item.imageUrl && (
              <div className="w-full aspect-[3/4] rounded-lg overflow-hidden bg-yellow-50 border border-yellow-200 mb-3">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="space-y-2">
              <div>
                <h3 className="text-sm font-bold text-yellow-900 line-clamp-2 mb-1">
                  {item.title}
                </h3>
                {item.subtitle && (
                  <p className="text-xs text-[#7A674C] line-clamp-1">
                    {item.subtitle}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className={`text-[10px] px-2 py-1 rounded-full font-medium border ${getStatusColor(item.status)}`}>
                  {getStatusEmoji(item.status)} {item.status}
                </span>
                {item.rating && (
                  <span className="text-xs text-yellow-700">
                    {'⭐'.repeat(item.rating)}
                  </span>
                )}
              </div>

              {item.note && (
                <p className="text-xs text-[#5C4A33] line-clamp-2 italic">
                  "{item.note}"
                </p>
              )}

              {isOwnProfile && (
                <div className="flex gap-2 pt-2 border-t border-yellow-100">
                  <button
                    onClick={() => handleEditClick(item)}
                    className="text-[10px] text-yellow-700 hover:text-yellow-900 font-medium hover:underline"
                  >
                    Edit
                  </button>
                  <span className="text-[#C0A987]">·</span>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="text-[10px] text-[#7A674C] hover:text-red-600 font-medium hover:underline"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {showEditModal && editingItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-[#3A2E1F] mb-4">
              Edit {editingItem.title}
            </h2>

            <div className="space-y-4">
              {/* Status */}
              <div>
                <label className="block text-sm font-semibold text-[#3A2E1F] mb-2">
                  Status
                </label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value as ListItem['status'] })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-yellow-400 focus:outline-none"
                >
                  {getStatusOptions(activeList).map((status) => (
                    <option key={status} value={status}>
                      {getStatusEmoji(status)} {status}
                    </option>
                  ))}
                </select>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-semibold text-[#3A2E1F] mb-2">
                  Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setEditForm({ ...editForm, rating: star })}
                      className={`text-2xl transition-all hover:scale-110 ${
                        star <= editForm.rating ? 'opacity-100' : 'opacity-30'
                      }`}
                    >
                      ⭐
                    </button>
                  ))}
                  {editForm.rating > 0 && (
                    <button
                      onClick={() => setEditForm({ ...editForm, rating: 0 })}
                      className="text-xs text-gray-500 hover:text-red-600 ml-2"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Note */}
              <div>
                <label className="block text-sm font-semibold text-[#3A2E1F] mb-2">
                  Note
                </label>
                <textarea
                  value={editForm.note}
                  onChange={(e) => setEditForm({ ...editForm, note: e.target.value })}
                  placeholder="Add your thoughts..."
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-yellow-400 focus:outline-none resize-none"
                  rows={4}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingItem(null);
                }}
                className="flex-1 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#3A2E1F] font-semibold transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="flex-1 px-4 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-[#3A2E1F] font-semibold shadow-md hover:shadow-lg transition-all"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
