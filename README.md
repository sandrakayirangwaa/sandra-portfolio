# Sandra Kayirangwa portfolio

An animated personal site built with Next.js, React, TypeScript and GSAP. It builds to plain static files.

## Run it

You need Node.js 20 or newer.

    npm install
    npm run dev

Open http://localhost:3000.

## Deploy it

**Vercel:** push this folder to GitHub, choose **Add New Project** in Vercel, and import the repo. The default settings work.

**Any other static host:** run `npm run build` and upload the `out` folder.

## Change the content

| To change | Edit |
| --- | --- |
| Bio, skills, links, email, projects, skill filters | `data/profile.ts` |
| Your CV | Update the file in Google Drive, or change `cv` in `data/profile.ts` |
| Words that change on Home | `builds` in `data/profile.ts` |
| About photo | Add it to `public`, then set `photo` in `data/profile.ts` |
| Signature | Replace the strokes in `components/Signature.tsx`. `components/LiveSignature.tsx` animates them |
| Colors and type | The top of `app/globals.css` |

## Add a project

Add a smaller project to `moreProjects` in `data/profile.ts`; it needs a name, a line, its stack, its skills and a repo link. For a full project page, add an entry to `projects`. Each point lists the skills it shows, which drives the filters on the Work page. Add `repo` and `live` to show those links on the project page. The `flow` block defines the steps and scenarios in the interactive diagram.

## How the contact form works

The form opens the visitor's email app with the message filled in. It does not send anything itself, so the site needs no server.
