# Setup Checklist ✓

Follow these steps to get your Task Tracker running with the new database:

## 🔧 Initial Setup

- [ ] **Step 1**: Install dependencies
  ```bash
  npm install
  ```
  This installs all packages including Prisma and auto-generates the Prisma Client.

- [ ] **Step 2**: Initialize database
  ```bash
  npm run db:push
  ```
  This creates `prisma/dev.db` and applies the schema.

- [ ] **Step 3**: Start development server
  ```bash
  npm run dev
  ```
  Open http://localhost:3000

## ✅ Verification Steps

- [ ] **Test Boards**
  - [ ] Create a new board
  - [ ] View board in the list
  - [ ] Select the board

- [ ] **Test Tasks**
  - [ ] Add a task to the board
  - [ ] Drag task from "To Do" to "In Progress"
  - [ ] Drag task from "In Progress" to "Done"
  - [ ] Edit a task
  - [ ] Delete a task

- [ ] **Test Notes**
  - [ ] Navigate to Notes page
  - [ ] Create a new note
  - [ ] Search for the note
  - [ ] Edit the note
  - [ ] Delete the note

- [ ] **Test Persistence**
  - [ ] Stop the dev server (Ctrl+C)
  - [ ] Restart with `npm run dev`
  - [ ] Verify all data is still there

- [ ] **Test Cascade Delete**
  - [ ] Create a board with tasks
  - [ ] Delete the board
  - [ ] Verify tasks are also deleted

## 🛠️ Optional: Explore Database

- [ ] **Open Prisma Studio**
  ```bash
  npm run db:studio
  ```
  This opens a visual database editor at http://localhost:5555

- [ ] **View Tables**
  - [ ] Check Board table
  - [ ] Check Task table
  - [ ] Check Note table

- [ ] **Inspect Data**
  - [ ] View records
  - [ ] Check relationships
  - [ ] Verify timestamps

## 📚 Documentation Review

- [ ] Read `README.md` - Main documentation
- [ ] Read `QUICKSTART.md` - Quick setup guide
- [ ] Read `DATABASE_MIGRATION.md` - Migration details
- [ ] Read `ARCHITECTURE.md` - System architecture
- [ ] Read `DB_INTEGRATION_SUMMARY.md` - Integration summary

## 🚀 Production Checklist (Future)

When ready to deploy:

- [ ] Choose production database (PostgreSQL/MySQL)
- [ ] Update `prisma/schema.prisma` datasource
- [ ] Set `DATABASE_URL` environment variable
- [ ] Run `npx prisma migrate dev` to create migrations
- [ ] Run `npx prisma migrate deploy` in production
- [ ] Add error handling and logging
- [ ] Implement rate limiting
- [ ] Add authentication
- [ ] Set up monitoring

## 🐛 Troubleshooting

If you encounter issues:

### Issue: "Cannot find module '@prisma/client'"
```bash
npm install
npx prisma generate
```

### Issue: Database errors
```bash
# Delete database and recreate
rm prisma/dev.db
npm run db:push
```

### Issue: Changes not saving
- Check browser console for errors
- Verify dev server is running
- Check API routes are responding

### Issue: Prisma Client out of sync
```bash
npx prisma generate
```

## 📝 Notes

- ✅ All data is stored in `prisma/dev.db`
- ✅ Database file is gitignored
- ✅ No external database server needed
- ✅ Easy to migrate to PostgreSQL/MySQL later
- ✅ All operations are type-safe with TypeScript

## 🎯 Success Criteria

You're all set when:
- ✅ Server starts without errors
- ✅ Can create and manage boards
- ✅ Can create and drag tasks
- ✅ Can create and search notes
- ✅ Data persists after restart
- ✅ Prisma Studio shows your data

---

**Current Status**: Ready to start! 🚀

Run `npm install && npm run db:push && npm run dev` to begin.
