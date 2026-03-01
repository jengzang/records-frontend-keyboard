# Keyboard/Mouse Analysis Module - Testing Guide

**Date**: 2026-02-23
**Status**: Ready for Testing

## Quick Start Testing

### 1. Install Frontend Dependencies
```bash
cd keyboard
npm install
```

### 2. Start Backend Server
```bash
cd go-backend
go build -o bin/keyboard-server.exe ./cmd/keyboard-server
./bin/keyboard-server.exe
```

### 3. Start Frontend Development Server
```bash
cd keyboard
npm run dev
```

### 4. Open Browser
Navigate to: http://localhost:5173/heatmap

## Testing Checklist

### Keyboard Heatmap Page
- [ ] Keyboard renders with 60+ keys
- [ ] Keys have color gradient (white → red)
- [ ] Space key is darkest (highest usage)
- [ ] Hover shows tooltip with 6 statistics
- [ ] Date range filter works
- [ ] Refresh button works
- [ ] Responsive on mobile

### API Endpoints
```bash
# Test detailed heatmap
curl http://localhost:8080/api/keyboard/heatmap/detailed

# Test temporal analysis
curl "http://localhost:8080/api/keyboard/statistics/temporal?type=daily"

# Test category analysis
curl "http://localhost:8080/api/keyboard/statistics/categories?type=distribution"
```

## Common Issues

### Issue: Backend API Not Responding
**Solution**: Check if backend is running on port 8080

### Issue: Frontend Build Errors
**Solution**: Run `npm install` to install dependencies

### Issue: Python Worker Fails
**Solution**: Verify Python 3 is installed and database path is correct

---

For detailed testing guide, see full documentation.
