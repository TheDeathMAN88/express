# Quick Customization Guide 🎯

## 🚨 Edit These First!

Open `src/app/page.tsx` and find these lines near the top:

```typescript
// ============================================================
// EDIT HERE - Customize these values
// ============================================================
const PARTNER_NAME = 'Wifey'; // EDIT HERE: Your partner's name
const SECRET_WORD = 'forever'; // EDIT HERE: The secret password
const ANNIVERSARY_DATE = { year: 2024, month: 6, day: 14 }; // EDIT HERE: Anniversary date
// ============================================================
```

### What to Change:
1. **PARTNER_NAME**: Replace 'Wifey' with your partner's name (e.g., 'Sarah', 'Baby', 'Honey')
2. **SECRET_WORD**: Replace 'forever' with a special word only you both know
3. **ANNIVERSARY_DATE**: Set your anniversary date (year, month, day)

---

## 💌 Customize Envelope Messages

In `src/app/page.tsx`, find the `defaultEnvelopes` array and personalize the messages:

```typescript
const defaultEnvelopes: Envelope[] = [
  {
    id: 'default-1',
    title: 'Open when you miss me',
    message: 'Your personalized message here...',
    extraMessage: 'Hidden message revealed after 3 seconds 💕',
  },
  // ... 7 more envelopes
];
```

**Tips:**
- Keep titles short and sweet
- Write heartfelt, personal messages
- Use `extraMessage` for surprise reveals
- Add inside jokes and personal memories

---

## 💝 Customize Love Vows

Find the `vows` array in `src/app/page.tsx`:

```typescript
const vows = [
  `I promise to love ${PARTNER_NAME} more each day, to cherish every moment...`,
  `I vow to support ${PARTNER_NAME} in all your dreams...`,
  // ... more vows
];
```

**Tips:**
- Use `${PARTNER_NAME}` to automatically insert your partner's name
- Write promises that are meaningful to your relationship
- Mix serious and playful vows
- Include future commitments

---

## 📸 Add Your Photos

1. Open the website in your browser
2. Enter the secret password
3. Scroll to "Our Memories" section
4. Click "Upload Photos" button
5. Select photos from your device
6. Photos will appear in the gallery

---

## 📝 Add Timeline Memories

1. Click "Add a Memory" button in the "Our Journey" section
2. Fill in:
   - **Title**: Brief description (e.g., "Our First Date")
   - **Date**: Select from calendar
   - **Memory**: Write the full story
3. Click "Save Memory"

---

## ✉️ Add Custom Envelopes

1. Scroll to "Open When..." section
2. Click the dashed card with "Add a new envelope"
3. Fill in:
   - **Title**: When should this be opened? (e.g., "Open when you need a hug")
   - **Message**: Your main message
   - **Hidden Message**: Optional surprise that appears after 3 seconds
4. Click "Save Envelope"

---

## 💾 Backup Your Memories

**Export:**
1. Scroll to "Share Our Love" section
2. Click "Export Memories"
3. JSON file downloads automatically

**Import:**
1. Click "Import Memories"
2. Select your backup JSON file
3. All memories restored

---

## 🎨 Design Customization (Optional)

If you want to change the color scheme, search for these colors in `src/app/page.tsx`:

- `pink-400`, `pink-500`: Primary pink accents
- `purple-400`, `purple-500`: Primary purple accents
- `teal-400`, `teal-500`: Teal accents

Replace with your preferred colors:
- Red theme: `red-400`, `red-500`
- Blue theme: `blue-400`, `blue-500`
- Orange theme: `orange-400`, `orange-500`

---

## 📱 Test on Mobile

Open the website on your phone to test:
- Password lock screen
- Touch interactions
- Photo lightbox with swipe
- All animations
- Responsive layout

---

## 🚀 Deploy Your Website

1. Customize all "EDIT HERE" sections
2. Add your photos and memories
3. Test everything on desktop and mobile
4. Export a backup
5. Deploy to Vercel, Netlify, or any hosting service

---

## 💌 Share with Your Partner

Once deployed:
1. Copy the URL using "Copy Link" button
2. Send them the link
3. Tell them the secret word
4. Watch them explore all your love! 💕

---

## 💡 Pro Tips

- **Personal touches**: Include inside jokes and shared memories
- **Photos**: Add photos that tell your story together
- **Timeline**: Start from when you met and add all important moments
- **Envelopes**: Create envelopes for future occasions
- **Vows**: Mix serious promises with lighthearted ones
- **Backup**: Export regularly to save all your memories

---

## 🆘 Troubleshooting

**Photos not uploading?**
- Check file size (try smaller images)
- Ensure images are in JPG/PNG format
- Check browser console for errors

**Password not working?**
- Make sure you're typing the correct secret word
- Check for typos in the SECRET_WORD constant
- Try clearing browser cache

**Timeline not saving?**
- Check all required fields are filled
- Verify date format (MM/DD/YYYY)
- Check browser console for errors

---

**Made with 💕 for your special someone**
