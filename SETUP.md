# Connect Supabase and Vercel

Do the steps in this order. Dashboard menu names may differ slightly.
**Never share or commit passwords, secret keys, service_role keys or database connection strings.**

## 1. Create the database
1. Supabase > **SQL Editor** > new query.
2. Copy all of `supabase/setup.sql`, paste it, and click **Run**. Run it once, on a new project.
   If Supabase warns about the query, it should be only because it creates things; do not edit the file.
3. Expected: success, and **Table Editor** shows 8 tables. If you see an error, copy the error text only.

Never run anything in `supabase/tests/` on Supabase.

## 2. Block public sign-up
**Authentication > Sign In / Providers**: turn **off** "Allow new users to sign up". Save.

## 3. Add the two admins
For each person:
1. **Authentication > Users > Add user > Create new user.** Enter their email and a strong temporary password, and tick **Auto confirm user**.
2. In **SQL Editor**, paste `supabase/add-admin.sql`, replace `ADMIN NAME` and the email, and run it.
   It must return **1 row**. No rows means the email did not match.

Give each person their temporary password privately. After first sign-in they open **Password** and change it.

## 4. Copy two public values
From **Project Settings > API Keys** (or the **Connect** button):
- Project URL, like `https://xxxx.supabase.co`
- Publishable key, starting `sb_publishable_`

Do **not** use a key starting `sb_secret_` or the `service_role` key. This website does not need them.

## 5. Vercel
1. Push the code to your GitHub repository and import it in Vercel (framework: Next.js).
2. **Settings > Environment Variables** (Production and Preview):

| Name | Value |
| --- | --- |
| NEXT_PUBLIC_SUPABASE_URL | your Project URL, no trailing slash |
| NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY | your publishable key |
| SITE_URL | your live address, no trailing slash |
| SITE_LAUNCHED | false |

3. **Settings > Functions > Function Region**: choose the region closest to your Supabase region (Mumbai `bom1` or Singapore `sin1`).
4. **Redeploy.** Changes to these variables only apply to a new deployment.

If the build fails with "Could not load website content", check that step 1 succeeded and both values are correct.

**Preview and production use the same database.** Anything published from a preview's admin appears on the live site.

## 6. Test on the real services (required before launch)
Admin address: `your-site-address/admin`
- [ ] Both admins can sign in and change their password
- [ ] Save a test notice as draft: not visible in a private window
- [ ] Publish it: visible within a few seconds (refresh once), with no redeployment
- [ ] Unpublish it, then delete it: gone from Home, Notices and its own address
- [ ] Upload a photo: it shows in Gallery; delete it
- [ ] Create a third user under Authentication (do not add to admins): sign-in to /admin is refused. Delete that user.
- [ ] Sign-up is still switched off
- [ ] Supabase **Advisors > Security** shows no errors you have not reviewed

## Lost password
The site has no "forgot password" email. In **Authentication > Users**, delete that admin's user, create it again,
and run `add-admin.sql` again. Website content is not affected. Keep two-step verification on for the Supabase owner account.

## Backups
The free plan has no automatic backups. Weekly, export the database and download the `media` files to private club storage.
