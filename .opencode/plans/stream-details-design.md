# Stream Details Page Design

## Overview

Add a clickable stream card on `/dashboard/admin/streams` that navigates to a new StreamDetails page showing the stream's information and its associated regions.

## Goals

- Allow users to view stream details and the regions belonging to that stream
- Follow existing patterns (mirror RegionDetails)
- Minimal new concepts

## Non-Goals

- CRUD operations for streams (edit/delete buttons remain non-functional for now)
- Search/filter on the streams list page

## Changes

### 1. Navigation & Routing

**`src/App.tsx`**
- Add route: `<Route path="admin/streams/:id" element={<StreamDetails />} />`

**`src/pages/Admin/ManageStreams.tsx`**
- Add `onClick` handler to `stream-card` div → `navigate(/dashboard/admin/streams/${stream.id})`
- Add `useNavigate` hook import

**`src/pages/Admin/ManageStreams.css`**
- Add `cursor: pointer` to `.stream-card`

### 2. API Layer (`src/api/streams.ts`)

Add two new functions:

```ts
export const fetchStream = async (id: number): Promise<Stream> =>
  apiClient.get(`/v2/streams/${id}`).then(res => res.data);

export const fetchStreamRegions = async (id: number): Promise<Region[]> =>
  apiClient.get(`/v2/streams/${id}/regions`).then(res => res.data);
```

**Backend requirement:** `GET /v2/streams/:id/regions` must return regions filtered by stream ID.

### 3. StreamDetails Page

**`src/pages/Admin/StreamDetails.tsx`** (new file)

Layout (mirroring RegionDetails):
- **Header:** Back button + Stream name + description
- **Stream Info:** Meeting time, meeting day, overseer (with avatar)
- **Region List:** Grid of region cards, each showing:
  - Region name
  - Leader name + avatar
  - Bacenta count
  - Member count
  - Clickable → navigates to `/admin/regions/:id`

States: loading, error, success.

**`src/pages/Admin/StreamDetails.css`** (new file)

Reuse existing CSS classes from `RegionDetails.css` and `AdminShared.css` where possible. Add StreamDetails-specific styles for the stream header/info section.

## Files Modified

| File | Change |
|------|--------|
| `src/App.tsx` | Add route for `admin/streams/:id` |
| `src/pages/Admin/ManageStreams.tsx` | Add onClick to stream cards |
| `src/pages/Admin/ManageStreams.css` | Add cursor pointer |
| `src/api/streams.ts` | Add `fetchStream()` and `fetchStreamRegions()` |

## Files Created

| File | Purpose |
|------|---------|
| `src/pages/Admin/StreamDetails.tsx` | Stream details page component |
| `src/pages/Admin/StreamDetails.css` | Stream details styling |

## Data Flow

1. User clicks stream card on `/dashboard/admin/streams`
2. Navigates to `/dashboard/admin/streams/:id`
3. StreamDetails fetches stream by ID (`GET /v2/streams/:id`)
4. StreamDetails fetches regions by stream ID (`GET /v2/streams/:id/regions`)
5. Renders stream info + region card grid
6. Clicking a region card navigates to `/admin/regions/:id`
