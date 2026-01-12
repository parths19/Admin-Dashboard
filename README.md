# Admin Dashboard - Next.js with MUI and Zustand

A modern, responsive admin dashboard built with Next.js 14, Material-UI, and Zustand for state management. This application demonstrates authentication, user management, and product catalog features using the DummyJSON API.

## 🚀 Features

### 1. **Authentication** ✅
- Token-based authentication using DummyJSON API
- Protected routes with automatic redirection
- Persistent login state (localStorage)
- Logout functionality
- Toast notifications for success/error messages

### 2. **Users Management** ✅
- List all users with pagination
- Search users by name, email, or phone
- View detailed user information
- Responsive table layout
- Client-side caching (5-minute cache)

### 3. **Products Catalog** ✅
- Grid layout for products
- Pagination support
- Search functionality
- Category filter dropdown
- Product detail pages with image carousel
- Customer reviews display
- Responsive card design

### 4. **State Management with Zustand** ✅
- Centralized state management
- Built-in async actions for API calls
- Client-side caching strategy
- Persistent auth state

### 5. **UI/UX Optimization** ✅
- Material-UI components throughout
- Responsive design for all screen sizes
- Loading states
- Error handling with toast notifications
- Hover effects and transitions
- Clean, modern interface

### 6. **Performance Optimization** ✅
- React.memo for component optimization
- useCallback and useMemo hooks
- API-side pagination
- Client-side caching (reduces API calls)
- Debounced search inputs

## 🏗️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **UI Library:** Material-UI (MUI) v7
- **State Management:** Zustand v5
- **Styling:** Emotion (CSS-in-JS)
- **Icons:** Lucide React + MUI Icons
- **Notifications:** Sonner (Toast)
- **API:** DummyJSON (https://dummyjson.com)

## 📦 Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd <project-directory>
```

2. **Install dependencies**
```bash
yarn install
# or
npm install
```

3. **Run the development server**
```bash
yarn dev
# or
npm run dev
```

4. **Open in browser**
```
http://localhost:3000
```

## 🔐 Demo Credentials

To log in to the application, use these credentials from DummyJSON:

- **Username:** emilys
- **Password:** emilyspass

Other available users:
- Username: **michaelw** | Password: **michaelwpass**
- Username: **sophiab** | Password: **sophiabpass**

## 🗂️ Project Structure

```
/app
├── app/
│   ├── page.js                 # Login page
│   ├── layout.js               # Root layout
│   ├── globals.css             # Global styles
│   ├── dashboard/
│   │   └── page.js             # Dashboard home
│   ├── users/
│   │   ├── page.js             # Users list
│   │   └── [id]/page.js        # User detail
│   ├── products/
│   │   ├── page.js             # Products list
│   │   └── [id]/page.js        # Product detail
│   ├── store/
│   │   ├── authStore.js        # Auth state & actions
│   │   ├── usersStore.js       # Users state & actions
│   │   └── productsStore.js    # Products state & actions
│   └── components/
│       ├── Navbar.js           # Navigation bar
│       └── ProtectedRoute.js   # Route guard
├── package.json
└── README.md
```

## 🎯 Key Implementation Details

### Why Zustand?

Zustand was chosen for state management because:

1. **Simplicity:** No boilerplate code like Redux (no actions/reducers/dispatchers)
2. **Small Bundle Size:** ~1KB vs Redux ~20KB
3. **Built-in Async Support:** Handle async actions without middleware
4. **Easy Persistence:** Simple localStorage integration
5. **Better Developer Experience:** Clean API, easy to debug
6. **Perfect for Small-Medium Apps:** Ideal for this project size

### Caching Strategy

**Why Caching?**
- Reduces unnecessary API calls
- Improves performance and user experience
- Reduces server load
- Provides instant data on repeat visits

**Implementation:**
- Cache key format: `resource-limit-skip-query`
- 5-minute cache expiration (10 minutes for categories)
- Stored in Zustand state
- Manual cache invalidation available

Example:
```javascript
const cacheKey = `users-${limit}-${skip}-${searchQuery}`;
const cached = get().cache[cacheKey];

if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) {
  // Use cached data
  return cached.data;
}
// Fetch fresh data
```

### Performance Optimizations

1. **React.memo:** Prevents unnecessary re-renders of components
2. **useCallback:** Memoizes callback functions to maintain referential equality
3. **useMemo:** Memoizes computed values (e.g., totalPages calculation)
4. **Debounced Search:** 500ms delay before API call on search input
5. **API Pagination:** Only loads required data (10-12 items per page)
6. **Lazy Loading:** Images loaded on-demand

## 🔄 API Integration

All data comes from DummyJSON API:

- **Authentication:** `POST https://dummyjson.com/auth/login`
- **Users List:** `GET https://dummyjson.com/users?limit=10&skip=0`
- **Search Users:** `GET https://dummyjson.com/users/search?q=query`
- **Single User:** `GET https://dummyjson.com/users/{id}`
- **Products List:** `GET https://dummyjson.com/products?limit=12&skip=0`
- **Search Products:** `GET https://dummyjson.com/products/search?q=query`
- **Filter by Category:** `GET https://dummyjson.com/products/category/{category}`
- **Single Product:** `GET https://dummyjson.com/products/{id}`
- **Categories:** `GET https://dummyjson.com/products/categories`

## 🎨 UI Features

### Responsive Design
- Mobile-first approach
- Breakpoints: xs (0px), sm (600px), md (960px), lg (1280px)
- Grid system for layouts
- Responsive navigation

### Loading States
- Circular progress indicators during API calls
- Skeleton screens (optional enhancement)
- Disabled states during form submission

### Error Handling
- Toast notifications for errors
- User-friendly error messages
- Automatic error clearing after display
- Fallback UI for failed states

## 🚦 Routes

| Route | Description | Protected |
|-------|-------------|-----------|
| `/` | Login page | No |
| `/dashboard` | Dashboard home | Yes |
| `/users` | Users list with pagination & search | Yes |
| `/users/[id]` | Single user detail page | Yes |
| `/products` | Products grid with filters | Yes |
| `/products/[id]` | Single product detail page | Yes |

## 🧪 Testing Checklist

- [x] Login with valid credentials
- [x] Login with invalid credentials (error handling)
- [x] Logout functionality
- [x] Protected route redirection
- [x] Users list pagination
- [x] Users search functionality
- [x] User detail page
- [x] Products pagination
- [x] Products search functionality
- [x] Products category filter
- [x] Product detail page
- [x] Image carousel in product detail
- [x] Responsive design on mobile/tablet/desktop
- [x] Loading states
- [x] Error handling
- [x] Caching (check network tab for reduced calls)
- [x] Toast notifications

## 📝 Additional Notes

### Environment Variables
No environment variables required! All API endpoints use the public DummyJSON API.

### Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

### Known Limitations
- DummyJSON is a mock API, so data doesn't persist
- Token expires after 60 minutes (configurable)
- Some product images may load slowly depending on network

## 🎓 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Material-UI Documentation](https://mui.com/)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [DummyJSON API Docs](https://dummyjson.com/docs)

## 📄 License

This project is created for educational purposes.

---

**Built with ❤️ using Next.js, MUI, and Zustand**
