import { config, collection, singleton, fields } from '@keystatic/core';

const focal = () => fields.select({
  label: 'Focal Point',
  description: 'Controls which part of the image stays visible when cropped by the container.',
  options: [
    { label: 'Center (default)', value: 'center' },
    { label: 'Top', value: 'top' },
    { label: 'Bottom', value: 'bottom' },
    { label: 'Left', value: 'left' },
    { label: 'Right', value: 'right' },
  ],
  defaultValue: 'center',
});

const img = (label, dir) => fields.object({
  src: fields.image({
    label,
    directory: `public/images/${dir}`,
    publicPath: `/images/${dir}/`,
  }),
  focal: focal(),
});

const imgArray = (label, dir) => fields.array(
  fields.object({
    src: fields.image({
      label: 'Image',
      directory: `public/images/${dir}`,
      publicPath: `/images/${dir}/`,
    }),
    focal: focal(),
  }),
  { label },
);

const isProd = process.env.NODE_ENV === 'production' || process.env.KEYSTATIC_GITHUB_CLIENT_ID;

export default config({
  storage: isProd
    ? {
        kind: 'github',
        repo: {
          owner: 'mhutcheon92',
          name: 'hutcheon-photo',
        },
      }
    : { kind: 'local' },

  singletons: {

    homePage: singleton({
      label: 'Home Page',
      path: 'content/pages/home',
      schema: {
        heroImage:    img('Hero Photo', 'home'),
        heroEyebrow:  fields.text({ label: 'Hero Eyebrow' }),
        heroTitle:    fields.text({ label: 'Hero Title' }),
        heroSub:      fields.text({ label: 'Hero Subtitle', multiline: true }),
        heroLocation: fields.text({ label: 'Hero Location Tag' }),
        heroBody:     fields.text({ label: 'Hero Body Text', multiline: true }),
        adventurePreviewImages: imgArray('Adventure Preview Images', 'home'),
        elopementPreviewImages: imgArray('Elopement Preview Images', 'home'),
        aboutPortraitImage:     img('About Portrait Photo', 'home'),
      },
    }),

    elopementsPage: singleton({
      label: 'Elopements Page',
      path: 'content/pages/elopements',
      schema: {
        carouselImages:  imgArray('Carousel Slides', 'elopements'),
        heroEyebrow:     fields.text({ label: 'Hero Eyebrow' }),
        heroTitle:       fields.text({ label: 'Hero Title' }),
        heroSub:         fields.text({ label: 'Hero Subtitle' }),
        heroLocation:    fields.text({ label: 'Hero Location Tag' }),
        introText:       fields.text({ label: 'Intro Paragraph', multiline: true }),
        introSig:        fields.text({ label: 'Intro Signature' }),
        galleryImages:   imgArray('Gallery Images', 'elopements'),
        expectEyebrow:   fields.text({ label: 'What to Expect — Eyebrow' }),
        expectTitle:     fields.text({ label: 'What to Expect — Title' }),
        expectSteps: fields.array(
          fields.object({
            number: fields.text({ label: 'Step Number (e.g. 01)' }),
            title:  fields.text({ label: 'Step Title' }),
            text:   fields.text({ label: 'Step Text', multiline: true }),
          }),
          { label: 'What to Expect Steps', itemLabel: props => props.fields.title.value },
        ),
        pricingEyebrow: fields.text({ label: 'Investment — Eyebrow' }),
        pricingTitle:   fields.text({ label: 'Investment — Title', multiline: true }),
        pricingSub:     fields.text({ label: 'Investment — Subtitle' }),
        ctaEyebrow:     fields.text({ label: 'CTA Eyebrow' }),
        ctaTitle:       fields.text({ label: 'CTA Title' }),
        ctaSub:         fields.text({ label: 'CTA Subtitle' }),
      },
    }),

    adventuresPage: singleton({
      label: 'Adventures Page',
      path: 'content/pages/adventures',
      schema: {
        heroImage:    img('Hero Photo', 'adventures-page'),
        heroEyebrow:  fields.text({ label: 'Hero Eyebrow' }),
        heroTitle:    fields.text({ label: 'Hero Title' }),
        heroSub:      fields.text({ label: 'Hero Subtitle' }),
        heroLocation: fields.text({ label: 'Hero Location Tag' }),
        ctaEyebrow:   fields.text({ label: 'CTA Eyebrow' }),
        ctaTitle:     fields.text({ label: 'CTA Title' }),
        ctaSub:       fields.text({ label: 'CTA Subtitle' }),
      },
    }),

    pricingPage: singleton({
      label: 'Pricing Page',
      path: 'content/pages/pricing',
      schema: {
        heroImage:     img('Hero Photo', 'pricing'),
        heroEyebrow:   fields.text({ label: 'Hero Eyebrow' }),
        heroTitle:     fields.text({ label: 'Hero Title' }),
        heroSub:       fields.text({ label: 'Hero Subtitle' }),
        heroLocation:  fields.text({ label: 'Hero Location Tag' }),
        introEyebrow:  fields.text({ label: 'Intro Eyebrow' }),
        introStatement: fields.text({ label: 'Intro Statement', multiline: true }),
        introBody:     fields.text({ label: 'Intro Body', multiline: true }),
        packages: fields.array(
          fields.object({
            name:        fields.text({ label: 'Package Name' }),
            price:       fields.text({ label: 'Price (e.g. $2,500)' }),
            description: fields.text({ label: 'Description', multiline: true }),
            featured:    fields.checkbox({ label: 'Featured (highlighted card)' }),
            features:    fields.array(
              fields.text({ label: 'Feature' }),
              { label: 'Features', itemLabel: props => props.fields.value.value },
            ),
          }),
          { label: 'Packages', itemLabel: props => props.fields.name.value },
        ),
        alwaysIncluded: fields.array(
          fields.text({ label: 'Item' }),
          { label: 'Always Included Items', itemLabel: props => props.fields.value.value },
        ),
        addOnsParagraph1: fields.text({ label: 'Add-Ons Paragraph 1', multiline: true }),
        addOnsParagraph2: fields.text({ label: 'Add-Ons Paragraph 2', multiline: true }),
        ctaEyebrow: fields.text({ label: 'CTA Eyebrow' }),
        ctaTitle:   fields.text({ label: 'CTA Title' }),
        ctaSub:     fields.text({ label: 'CTA Subtitle' }),
      },
    }),

    aboutPage: singleton({
      label: 'About Page',
      path: 'content/pages/about',
      schema: {
        heroImage:      img('Hero Photo', 'about'),
        heroEyebrow:    fields.text({ label: 'Hero Eyebrow' }),
        heroTitle:      fields.text({ label: 'Hero Title' }),
        heroSub:        fields.text({ label: 'Hero Subtitle' }),
        heroLocation:   fields.text({ label: 'Hero Location Tag' }),
        portraitImage:  img('Portrait Photo', 'about'),
        introEyebrow:   fields.text({ label: 'Intro Eyebrow' }),
        introStatement: fields.text({ label: 'Intro Statement', multiline: true }),
        introBody:      fields.text({ label: 'Intro Body', multiline: true }),
        narrativeEyebrow: fields.text({ label: 'Narrative Eyebrow' }),
        narrativeParagraphs: fields.array(
          fields.text({ label: 'Paragraph', multiline: true }),
          { label: 'Narrative Paragraphs' },
        ),
        philosophyImage:   img('Philosophy Section Photo', 'about'),
        philosophyEyebrow: fields.text({ label: 'Philosophy Eyebrow' }),
        philosophyTitle:   fields.text({ label: 'Philosophy Title' }),
        philosophyParagraphs: fields.array(
          fields.text({ label: 'Paragraph', multiline: true }),
          { label: 'Philosophy Paragraphs' },
        ),
        ctaEyebrow: fields.text({ label: 'CTA Eyebrow' }),
        ctaTitle:   fields.text({ label: 'CTA Title' }),
        ctaSub:     fields.text({ label: 'CTA Subtitle' }),
      },
    }),

    contactPage: singleton({
      label: 'Contact Page',
      path: 'content/pages/contact',
      schema: {
        heroImage:       img('Hero Photo', 'contact'),
        heroEyebrow:     fields.text({ label: 'Hero Eyebrow' }),
        heroTitle:       fields.text({ label: 'Hero Title' }),
        heroSub:         fields.text({ label: 'Hero Subtitle' }),
        heroLocation:    fields.text({ label: 'Hero Location Tag' }),
        thankYouEyebrow: fields.text({ label: 'Thank You Eyebrow' }),
        thankYouMessage: fields.text({ label: 'Thank You Message' }),
      },
    }),

    blogListPage: singleton({
      label: 'Blog Page',
      path: 'content/pages/blog',
      schema: {
        heroImage:    img('Hero Photo', 'blog-page'),
        heroEyebrow:  fields.text({ label: 'Hero Eyebrow' }),
        heroTitle:    fields.text({ label: 'Hero Title' }),
        heroSub:      fields.text({ label: 'Hero Subtitle' }),
        heroLocation: fields.text({ label: 'Hero Location Tag' }),
        ctaEyebrow:   fields.text({ label: 'CTA Eyebrow' }),
        ctaTitle:     fields.text({ label: 'CTA Title' }),
        ctaSub:       fields.text({ label: 'CTA Subtitle' }),
      },
    }),

  },

  collections: {

    adventures: collection({
      label: 'Adventures',
      slugField: 'title',
      path: 'content/adventures/*',
      schema: {
        title:     fields.slug({ name: { label: 'Title' } }),
        eyebrow:   fields.text({ label: 'Eyebrow (location & date)' }),
        sub:       fields.text({ label: 'Caption', multiline: true }),
        gradient:  fields.text({ label: 'Placeholder gradient (CSS string)' }),
        image:     img('Hero Photo', 'adventures'),
        listImage: img('Listing Card Image', 'adventures'),
        galleryImages: imgArray('Gallery Images', 'adventures'),
        body: fields.array(
          fields.text({ label: 'Paragraph', multiline: true }),
          { label: 'Body paragraphs' },
        ),
      },
    }),

    blogPosts: collection({
      label: 'Blog Posts',
      slugField: 'title',
      path: 'content/blog/*',
      schema: {
        title:     fields.slug({ name: { label: 'Title' } }),
        eyebrow:   fields.text({ label: 'Eyebrow (category & date)' }),
        sub:       fields.text({ label: 'Subtitle / dek', multiline: true }),
        gradient:  fields.text({ label: 'Placeholder gradient (CSS string)' }),
        image:     img('Hero Photo', 'blog'),
        listImage: img('Listing Card Image', 'blog'),
        body: fields.array(
          fields.text({ label: 'Paragraph', multiline: true }),
          { label: 'Body paragraphs' },
        ),
      },
    }),

  },
});
