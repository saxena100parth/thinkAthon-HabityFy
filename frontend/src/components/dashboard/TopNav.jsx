import { useState } from 'react';
import { Bell, Search, LogOut, ChevronDown, X } from 'lucide-react';
import { useSearch } from '../../contexts/SearchContext';

const TopNav = ({ user, unreadCount, onMenuClick, onLogout }) => {
    const [showUserMenu, setShowUserMenu] = useState(false);
    const { searchTerm, setSearchTerm, clearSearch, getSearchStats, isSearching } = useSearch();
    const [showSearchResults, setShowSearchResults] = useState(false);

    return (
        <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Left side */}
                    <div className="flex items-center">
                        <button
                            onClick={onMenuClick}
                            className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 mr-2"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>

                        {/* Search */}
                        <div className="hidden md:block">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    {isSearching ? (
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                                    ) : (
                                        <Search className="h-5 w-5 text-gray-400" />
                                    )}
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search habits..."
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setShowSearchResults(e.target.value.length > 0);
                                    }}
                                    onFocus={() => setShowSearchResults(searchTerm.length > 0)}
                                    className="block w-80 pl-10 pr-10 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-red-500 focus:border-red-500 sm:text-sm"
                                />
                                {searchTerm && (
                                    <button
                                        onClick={clearSearch}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    >
                                        <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                                    </button>
                                )}

                                {/* Search Results Dropdown */}
                                {showSearchResults && (
                                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                                        <SearchResultsDropdown
                                            onClose={() => setShowSearchResults(false)}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right side */}
                    <div className="flex items-center space-x-4">
                        {/* Notifications */}
                        <button
                            onClick={() => window.location.href = '/notifications'}
                            className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <Bell className="h-6 w-6" />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                    {unreadCount > 9 ? '9+' : unreadCount}
                                </span>
                            )}
                        </button>

                        {/* User menu */}
                        <div className="relative">
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                                    <span className="text-white font-medium text-sm">
                                        {user?.username?.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div className="hidden md:block text-left">
                                    <p className="text-sm font-medium text-gray-900">{user?.username}</p>
                                    <p className="text-xs text-gray-500">{user?.email}</p>
                                </div>
                                <ChevronDown className="h-4 w-4 text-gray-400" />
                            </button>

                            {/* Dropdown menu */}
                            {showUserMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-200">
                                    <div className="px-4 py-2 border-b border-gray-100">
                                        <p className="text-sm font-medium text-gray-900">{user?.username}</p>
                                        <p className="text-xs text-gray-500">{user?.email}</p>
                                    </div>
                                    <button
                                        onClick={onLogout}
                                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                    >
                                        <LogOut className="mr-3 h-4 w-4" />
                                        Sign out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

// Search Results Dropdown Component
const SearchResultsDropdown = ({ onClose }) => {
    const { searchResults, searchTerm, getSearchStats } = useSearch();
    const stats = getSearchStats();

    if (!searchTerm) return null;

    return (
        <div className="p-4">
            {/* Search Stats */}
            <div className="mb-3 pb-3 border-b border-gray-100">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">
                        Search Results
                    </span>
                    <span className="text-sm text-gray-500">
                        {stats.found} of {stats.total} habits
                    </span>
                </div>
                {stats.percentage > 0 && (
                    <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div
                                className="bg-red-600 h-1.5 rounded-full transition-all duration-300"
                                style={{ width: `${stats.percentage}%` }}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Results */}
            {searchResults.length > 0 ? (
                <div className="space-y-2">
                    {searchResults.slice(0, 5).map((habit) => (
                        <div
                            key={habit._id}
                            className="p-3 rounded-lg hover:bg-gray-50 cursor-pointer border border-gray-100"
                            onClick={onClose}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <h4 className="text-sm font-medium text-gray-900 truncate">
                                        {habit.title}
                                    </h4>
                                    {habit.description && (
                                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                            {habit.description}
                                        </p>
                                    )}
                                    <div className="flex items-center mt-2 space-x-2">
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                            {habit.frequency}
                                        </span>
                                        {habit.tags && habit.tags.length > 0 && (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                                {habit.tags[0]}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="ml-2 flex-shrink-0">
                                    {habit.isActive ? (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            Active
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                            Inactive
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    {searchResults.length > 5 && (
                        <div className="text-center py-2">
                            <span className="text-xs text-gray-500">
                                And {searchResults.length - 5} more results...
                            </span>
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center py-4">
                    <Search className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No habits found</p>
                    <p className="text-xs text-gray-400 mt-1">
                        Try different search terms
                    </p>
                </div>
            )}
        </div>
    );
};

export default TopNav;
