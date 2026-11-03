# PanelUI

> An accessible React Native component library for Expo. 141 typed components, styled with Tailwind CSS, animated on the UI thread, and running in Expo Go.

## Sections

- [Introduction](https://panelui.dev/docs): PanelUI is an accessible, high-performance React Native component library for Expo, styled with Tailwind CSS and animated on the UI thread.
- [Components](https://panelui.dev/docs/components): Every component module in PanelUI, by what it is for — 141 component modules, each with its anatomy, props and variants.
- [Installation](https://panelui.dev/docs/installation): Install PanelUI in an Expo app — a new one in a single command, an existing one in six steps, with a fix for every error you might hit.
- [Troubleshooting](https://panelui.dev/docs/troubleshooting): What to do when the app installs cleanly and then crashes, closes or refuses to start — on Android, in Expo Go, and after a version change.
- [Upgrading](https://panelui.dev/docs/upgrading): Upgrade PanelUI deliberately — current package versions, copied-source updates and the migrations that require code changes.
- [CLI](https://panelui.dev/docs/cli): Copy a single component's source into your project instead of installing the package.
- [Skills](https://panelui.dev/docs/skills): Give a coding agent working knowledge of PanelUI — the components, the tokens, the CLI — plus an MCP server that lets it read the registry directly.
- [Templates](https://panelui.dev/docs/templates): Start a new Expo app with PanelUI already wired — a theme, a native tab bar and the whole pipeline.
- [Native rendering](https://panelui.dev/docs/native): Hand a component to the platform's own UI toolkit with the native prop.
- [Performance](https://panelui.dev/docs/performance): The rules every component follows, and how to measure whether they held.

## Customization

- [Colors](https://panelui.dev/docs/customization/colors): The semantic colour tokens every component draws from, what each one is for, and how to change them.
- [Theming](https://panelui.dev/docs/customization/theming): Six built-in themes across three families, how to switch at runtime, and how to write a theme of your own.
- [Charts](https://panelui.dev/docs/customization/charts): The five-colour series ramp every chart draws from, how a series picks its colour, what to change to put a whole app's charts on brand, and how to build a chart the library does not ship.
- [Fonts](https://panelui.dev/docs/customization/fonts): Load a font and point five tokens at it. Every component in the library follows.
- [Icons](https://panelui.dev/docs/customization/icons): Every icon in the library, what to import, and how they take their colour and size.
- [Styling](https://panelui.dev/docs/customization/styling): className on every component, when to reach for style instead, and how to build your own components on top.
- [Sizing](https://panelui.dev/docs/customization/sizing): The five sizes every control shares, what each one sets, and how the small ones stay easy to press.

## AI (beta)

- [AI](https://panelui.dev/docs/ai): Building AI chat interfaces in React Native with PanelUI.
- [Setup](https://panelui.dev/docs/ai/setup): Dependencies, polyfills and getting the API URL right on a device.
- [API route](https://panelui.dev/docs/ai/api-route): The server handler that streams from the model.
- [Chat UI](https://panelui.dev/docs/ai/chat-ui): A transcript and composer built from PanelUI components.
- [Voice](https://panelui.dev/docs/ai/voice): A level from the microphone, an assistant that talks back, and voice notes in a transcript.
- [Streaming performance](https://panelui.dev/docs/ai/streaming-performance): Why token-by-token rendering drops frames on native, and what to do.
- [Tools](https://panelui.dev/docs/ai/tools): Letting the model call your code, and showing it in the conversation.

## Components

- [Accordion](https://panelui.dev/docs/components/accordion): Collapsible sections with single or multiple selection.
- [Alert](https://panelui.dev/docs/components/alert): Status message with a built-in icon.
- [AnimatedBadge](https://panelui.dev/docs/components/animated-badge): Status pill whose icon and label roll over when the status changes.
- [Attachment](https://panelui.dev/docs/components/attachment): File row with upload states, built on Item.
- [Avatar](https://panelui.dev/docs/components/avatar): User image with an initials fallback, a badge overlay, and a stack for a group of them.
- [AvatarCropper](https://panelui.dev/docs/components/avatar-cropper): Frame a photo under a circle, and get that circle back as an image.
- [Badge](https://panelui.dev/docs/components/badge): Compact status label, dot, or notification count.
- [BottomSheet](https://panelui.dev/docs/components/bottom-sheet): Draggable sheet anchored to the bottom of the screen.
- [Breadcrumb](https://panelui.dev/docs/components/breadcrumb): The trail of links back up the hierarchy to the current page.
- [Button](https://panelui.dev/docs/components/button): Pressable action with variants, sizes, loading state and icon slots.
- [ButtonGroup](https://panelui.dev/docs/components/button-group): Several buttons drawn as one control — a segmented run, a split action, a toolbar.
- [Calendar](https://panelui.dev/docs/components/calendar): A month of days, for picking one, several, or a range.
- [Camera](https://panelui.dev/docs/components/camera): A full-screen camera you assemble from parts.
- [Card](https://panelui.dev/docs/components/card): Content surface with header, body and footer.
- [Carousel](https://panelui.dev/docs/components/carousel): A run of slides, one at a time, dragged with a finger.
- [Checkbox](https://panelui.dev/docs/components/checkbox): Animated checkbox, as a row or a selectable card.
- [Chip](https://panelui.dev/docs/components/chip): Interactive pill — a filter, a tag, or a removable token.
- [CircularText](https://panelui.dev/docs/components/circular-text): Text set around a circle, turning.
- [Collapsible](https://panelui.dev/docs/components/collapsible): One section of content, shown and hidden by its own header.
- [ColorPicker](https://panelui.dev/docs/components/color-picker): A colour chosen by dragging — a saturation square or a wheel, a hue scale, and opacity.
- [Combobox](https://panelui.dev/docs/components/combobox): A text field that filters a list of options as you type.
- [Compare](https://panelui.dev/docs/components/compare): Two versions of one picture, with a seam you drag across it.
- [ContextMenu](https://panelui.dev/docs/components/context-menu): Actions for a piece of content, opened by holding it.
- [Countdown](https://panelui.dev/docs/components/countdown): The time left until a moment, ticking down to it.
- [DatePicker](https://panelui.dev/docs/components/date-picker): A calendar behind a button.
- [DateTimePicker](https://panelui.dev/docs/components/date-time-picker): A day and a time of day, picked in one panel.
- [Dialog](https://panelui.dev/docs/components/dialog): Modal dialog with a backdrop and footer actions.
- [Direction](https://panelui.dev/docs/components/direction): Reading direction for everything below it.
- [Drawer](https://panelui.dev/docs/components/drawer): A panel that comes in from an edge of the screen and covers the app until dismissed.
- [EmptyState](https://panelui.dev/docs/components/empty-state): Placeholder for a list or screen with no content.
- [Fab](https://panelui.dev/docs/components/fab): The floating action button — one action pinned over the content, with an optional dial of others behind it.
- [Feedback](https://panelui.dev/docs/components/feedback): Dialog whose body is a well to write in, with the actions in the band around it.
- [Field](https://panelui.dev/docs/components/field): Layout and validation-state kit a form control composes into.
- [FileUpload](https://panelui.dev/docs/components/file-upload): Pick files and photos, check them, and run their uploads.
- [FlipCard](https://panelui.dev/docs/components/flip-card): Two faces of one card, and a turn between them.
- [Flow](https://panelui.dev/docs/components/flow): Pan-and-zoom canvas of draggable nodes joined by animated edges.
- [Frame](https://panelui.dev/docs/components/frame): Widget shell — a card of rows sitting in a titled tray.
- [GridItem](https://panelui.dev/docs/components/grid-item): Bento tiles, and the grid that places them.
- [ImageViewer](https://panelui.dev/docs/components/image-viewer): An image that opens out of the page over a blur, to zoom into and swipe through.
- [Input](https://panelui.dev/docs/components/input): Text field with label, description and error message.
- [InputGroup](https://panelui.dev/docs/components/input-group): Input with leading and trailing decorators.
- [Item](https://panelui.dev/docs/components/item): Row of media, text and actions for lists and settings.
- [Kpi](https://panelui.dev/docs/components/kpi): One number, what it is doing, and the shape it made getting there.
- [Label](https://panelui.dev/docs/components/label): Form field label with required, invalid and disabled states.
- [Leaderboard](https://panelui.dev/docs/components/leaderboard): Entries ranked by a value, with the top three on a podium.
- [Loader](https://panelui.dev/docs/components/loader): Nine loading animations behind one variant prop.
- [Map](https://panelui.dev/docs/components/map): Vector map whose basemap is drawn from your theme tokens.
- [MarkdownEditor](https://panelui.dev/docs/components/markdown-editor): A field for writing markdown, with a formatting toolbar and a rendered preview.
- [Marker](https://panelui.dev/docs/components/marker): Inline note between conversation turns.
- [Marquee](https://panelui.dev/docs/components/marquee): Content that travels across its container on a loop.
- [Menu](https://panelui.dev/docs/components/menu): The list of things you can do to something.
- [Message](https://panelui.dev/docs/components/message): Chat turn with avatar, bubble, header and footer.
- [MessageScroller](https://panelui.dev/docs/components/message-scroller): Scroll behaviour a chat transcript needs.
- [Meter](https://panelui.dev/docs/components/meter): A measurement on a fixed scale, coloured by where it falls.
- [NumberInput](https://panelui.dev/docs/components/number-input): Numeric field stepped by buttons or typed by hand.
- [OtpInput](https://panelui.dev/docs/components/otp-input): One-time-code field drawn as a row of separate cells.
- [PageHeader](https://panelui.dev/docs/components/page-header): Cover, face and actions at the top of a profile.
- [Pagination](https://panelui.dev/docs/components/pagination): Paged navigation over a long result set.
- [Planner](https://panelui.dev/docs/components/planner): A month of days, each carrying what falls on it.
- [Popover](https://panelui.dev/docs/components/popover): Panel anchored to the element that opened it.
- [Post](https://panelui.dev/docs/components/post): A social card — author, body, media and the counts underneath, with the votes animated.
- [Progress](https://panelui.dev/docs/components/progress): Determinate and indeterminate progress bar.
- [ProgressButton](https://panelui.dev/docs/components/progress-button): Press and hold to confirm, with the wait drawn on the button.
- [QRCode](https://panelui.dev/docs/components/qr-code): A string a camera can read — framed, titled, or folded away behind a button.
- [Questionnaire](https://panelui.dev/docs/components/questionnaire): One question at a time, with progress, validation and a way back.
- [RadioGroup](https://panelui.dev/docs/components/radio-group): Single-select list of options.
- [Rating](https://panelui.dev/docs/components/rating): A row of stars to read or set a score.
- [ScrollBlur](https://panelui.dev/docs/components/scroll-blur): Blurs the edges of a scroll container.
- [ScrollCanvas](https://panelui.dev/docs/components/scroll-canvas): Image frame whose contents move as you scroll.
- [ScrollFade](https://panelui.dev/docs/components/scroll-fade): Fades the edges of a scroll container.
- [ScrollHeader](https://panelui.dev/docs/components/scroll-header): A screen title that hands over to a compact bar as the page scrolls.
- [ScrollText](https://panelui.dev/docs/components/scroll-text): Text that resolves word by word as you scroll.
- [SearchBar](https://panelui.dev/docs/components/search-bar): Search field with a clear button, a Cancel button and a panel of results.
- [SectionProgress](https://panelui.dev/docs/components/section-progress): Floating pill with a scroll ring and the section being read.
- [SectionRail](https://panelui.dev/docs/components/section-rail): Floating section navigator for a long screen.
- [Select](https://panelui.dev/docs/components/select): Picker shown in a bottom sheet, expanded in place, or floating over the page.
- [SelectionMode](https://panelui.dev/docs/components/selection-mode): Pick several things at once, on a screen or in a sheet.
- [Separator](https://panelui.dev/docs/components/separator): Horizontal or vertical rule between content, optionally labelled.
- [Signature](https://panelui.dev/docs/components/signature): Sign with a finger, and get the result back out as SVG or PNG.
- [Skeleton](https://panelui.dev/docs/components/skeleton): Shimmer placeholder for loading content.
- [Sketch](https://panelui.dev/docs/components/sketch): Draw with a pen, shapes and an eraser, in a sheet or a whole screen.
- [SlideButton](https://panelui.dev/docs/components/slide-button): Drag across to confirm, with the distance drawn on the button.
- [Slider](https://panelui.dev/docs/components/slider): Pick a value, or a span, by dragging a thumb along a track.
- [Sortable](https://panelui.dev/docs/components/sortable): A list whose rows can be dragged into a different order.
- [Spinner](https://panelui.dev/docs/components/spinner): Indeterminate loading indicator.
- [Splitter](https://panelui.dev/docs/components/splitter): Panes that share a container, with a seam between them you can drag.
- [SplitView](https://panelui.dev/docs/components/split-view): Two resizable stacked panes that settle on one of a few named heights.
- [StackCard](https://panelui.dev/docs/components/stack-card): A pile of cards, taken one at a time by throwing the top one off.
- [Steps](https://panelui.dev/docs/components/steps): Stepper for multi-step flows.
- [Support](https://panelui.dev/docs/components/support): The screen a person arrives on when they need help.
- [Surface](https://panelui.dev/docs/components/surface): Elevated container with a variant ladder.
- [Swipe](https://panelui.dev/docs/components/swipe): A row that slides aside to reveal the things you can do to it.
- [Switch](https://panelui.dev/docs/components/switch): Animated on/off toggle.
- [Table](https://panelui.dev/docs/components/table): Rows and columns that stay lined up, with sortable headers.
- [Tabs](https://panelui.dev/docs/components/tabs): Segmented navigation with an animated indicator.
- [TagInput](https://panelui.dev/docs/components/tag-input): A field whose value is a list of tokens rather than a string.
- [TextAnimation](https://panelui.dev/docs/components/text-animation): Five ways a piece of text or a number arrives.
- [Textarea](https://panelui.dev/docs/components/textarea): Text field that runs to several lines, sized in rows.
- [ThemeSelector](https://panelui.dev/docs/components/theme-selector): Light, dark or the device's setting, drawn as three miniature screens.
- [Timeline](https://panelui.dev/docs/components/timeline): A sequence of events, vertical or swiped sideways.
- [TimePicker](https://panelui.dev/docs/components/time-picker): A time of day, as a wheel, a clock or a swipeable scale.
- [Toast](https://panelui.dev/docs/components/toast): Transient notification queue with swipe to dismiss.
- [ToggleButton](https://panelui.dev/docs/components/toggle-button): A button that stays down, on its own or in a group.
- [Tooltip](https://panelui.dev/docs/components/tooltip): A small label that names the control under your finger.
- [Tour](https://panelui.dev/docs/components/tour): A walkthrough that introduces a screen one control at a time.
- [Tree](https://panelui.dev/docs/components/tree): A hierarchy you can open a level at a time.
- [Typography](https://panelui.dev/docs/components/typography): Semantic text presets.

## Charts

- [AreaChart](https://panelui.dev/docs/charts/area-chart): Filled bands over time, stacked or overlaid.
- [BarChart](https://panelui.dev/docs/charts/bar-chart): Categories compared by length, grouped or stacked.
- [BubbleChart](https://panelui.dev/docs/charts/bubble-chart): Named circles on two axes, with a third quantity on their area.
- [BumpChart](https://panelui.dev/docs/charts/bump-chart): How a set of things ranked against each other over time.
- [CandlestickChart](https://panelui.dev/docs/charts/candlestick-chart): Open, high, low and close for a period, drawn as one mark.
- [FunnelChart](https://panelui.dev/docs/charts/funnel-chart): Where a population drained away, one step at a time.
- [HeatmapChart](https://panelui.dev/docs/charts/heatmap-chart): Contribution grid with a themed colour ramp and a readout.
- [HexChart](https://panelui.dev/docs/charts/hex-chart): A whole broken into parts, counted out in cells.
- [LineChart](https://panelui.dev/docs/charts/line-chart): Animated time series, drawn on the UI thread.
- [LiveLineChart](https://panelui.dev/docs/charts/live-line-chart): A reading that keeps arriving, against a window that keeps moving.
- [MirrorAreaChart](https://panelui.dev/docs/charts/mirror-area-chart): Two readings of one timeline, one above a baseline and one below it.
- [PieChart](https://panelui.dev/docs/charts/pie-chart): One whole, divided between its parts.
- [Plot](https://panelui.dev/docs/charts/plot): A chart you assemble out of its marks.
- [PolarAreaChart](https://panelui.dev/docs/charts/polar-area-chart): Several readings on one scale, compared as wedges.
- [PyramidChart](https://panelui.dev/docs/charts/pyramid-chart): Two series mirrored about a centre, on one shared scale.
- [RadarChart](https://panelui.dev/docs/charts/radar-chart): Several measures of one thing, drawn as one shape.
- [RingChart](https://panelui.dev/docs/charts/ring-chart): Concentric arcs, each measured against its own target.
- [SankeyChart](https://panelui.dev/docs/charts/sankey-chart): Where a quantity came from and where it ended up.
- [ScatterChart](https://panelui.dev/docs/charts/scatter-chart): Two quantities against each other, to show how they relate.
- [TreemapChart](https://panelui.dev/docs/charts/treemap-chart): A total, cut into the parts it is made of, sized by area.
- [WaterfallChart](https://panelui.dev/docs/charts/waterfall-chart): How a run of changes carried one total to another.

## Blocks

- [Blocks](https://panelui.dev/docs/blocks): Whole screens built from PanelUI components, copied into your project with the CLI.
- [Boarding Pass](https://panelui.dev/docs/blocks/boarding-pass): A flight on one screen: the ticket, the time to boarding, the way to the gate, and a slide to check in.
- [Wallet](https://panelui.dev/docs/blocks/wallet): A stack of cards with one in front, a balance that rolls when it changes, spending by week, month or year, and swipeable activity.
- [Activity](https://panelui.dev/docs/blocks/activity): Goal rings, body readings, steps and a workout streak, all switched between day, week and month.
- [Smart Home](https://panelui.dev/docs/blocks/smart-home): A room at a time: climate in one row, scenes that set the devices, and a tile per device that toggles when pressed.

## AI Components

- [aiInput](https://panelui.dev/docs/ai-components/ai-input): A prompt composer: a field that grows to five lines, a row of controls, and the sheet they open.
- [CodeBlock](https://panelui.dev/docs/ai-components/code-block): A fenced snippet, syntax-coloured and scrolled sideways.
- [ImageGeneration](https://panelui.dev/docs/ai-components/image-generation): The place an image will be, while it is being made.
- [Panelside](https://panelui.dev/docs/ai-components/panelside): Navigation panel that moves the app aside instead of covering it.
- [Plan](https://panelui.dev/docs/ai-components/plan): What an agent intends to do, before it does it.
- [Reasoning](https://panelui.dev/docs/ai-components/reasoning): The model's working, shown while it happens and folded away after.
- [Response](https://panelui.dev/docs/ai-components/response): A model's answer, rendered as markdown while it is still arriving.
- [Shimmer](https://panelui.dev/docs/ai-components/shimmer): Animated highlight sweeping across content.
- [Soundwave](https://panelui.dev/docs/ai-components/soundwave): What a voice looks like while an app listens.
- [Sources](https://panelui.dev/docs/ai-components/sources): Where an answer came from, folded under a count.
- [Task](https://panelui.dev/docs/ai-components/task): One step an agent took, and what it did while it was there.
- [ThinkingOrb](https://panelui.dev/docs/ai-components/thinking-orb): Dotted orb saying which kind of busy an agent is.

## Form

- [Form](https://panelui.dev/docs/form/form): Form state — values, validation and submission — with no form library underneath.

## Hooks

- [useCopyToClipboard](https://panelui.dev/docs/hooks/use-copy-to-clipboard): Copy text to the clipboard with a temporary copied state.
- [useDirection and useDirectionSign](https://panelui.dev/docs/hooks/use-direction): Read the nearest LTR or RTL direction for layout and gesture maths.
- [useDisclosure](https://panelui.dev/docs/hooks/use-disclosure): Open and closed state for an overlay.
- [useBreakpoint](https://panelui.dev/docs/hooks/use-breakpoint): Responsive state derived from the window size.
- [useKeyboard](https://panelui.dev/docs/hooks/use-keyboard): Keyboard height and visibility.
- [useKeyboardAvoidance](https://panelui.dev/docs/hooks/use-keyboard-avoidance): Keep an element clear of the software keyboard.
- [useRevealProgress](https://panelui.dev/docs/hooks/use-reveal-progress): Derive a shared reveal value from an element's travel through a scroll viewport.
- [useScrollSections](https://panelui.dev/docs/hooks/use-scroll-sections): Track which section of a scroll view is being read.
- [useSkeletonHandoff](https://panelui.dev/docs/hooks/use-skeleton-handoff): Keep a placeholder on screen through a fade while the real content arrives.
- [useDebouncedValue](https://panelui.dev/docs/hooks/use-debounced-value): A copy of a value that settles after changes stop.
- [usePrevious](https://panelui.dev/docs/hooks/use-previous): The value from the previous render.
- [useBackHandler](https://panelui.dev/docs/hooks/use-back-handler): Run a handler when the Android hardware back button is pressed.
- [useTheme and useThemeMode](https://panelui.dev/docs/hooks/use-theme): Read and change the active theme.

## API Reference

- [Public API](https://panelui.dev/docs/reference): Every supported root export from panelui-native — 1501 symbols across 169 modules.
- [Component API](https://panelui.dev/docs/reference/components): 141 public component modules, linked to their guides and per-module export tables.
- [Hooks API](https://panelui.dev/docs/reference/hooks): Standalone public hooks, their values and option/result types.
- [Utilities API](https://panelui.dev/docs/reference/utilities): The complete public cn, color and time utility surface.
- [Foundations API](https://panelui.dev/docs/reference/foundations): Providers, themes, primitives and optional native bridges.
- [Icons API](https://panelui.dev/docs/reference/icons): Every icon and icon support export available from the package root.

## Integrations

- [Neon](https://panelui.dev/docs/integrations/neon): We recommend using Neon — serverless Postgres for the API routes behind a PanelUI app, with the connection string kept off the device.
- [Logo Maker](https://panelui.dev/docs/integrations/logo-maker): An agent skill that designs an original app logo — a compact mark that stays readable at 32 × 32, as a vector file or through an image model.
- [panelwind](https://panelui.dev/docs/integrations/panelwind): An ESLint plugin that checks how a screen uses the design system — and catches the classes that compile and then do nothing on a device.

## Studio

- [Overview](https://panelui.dev/docs/studio): PanelUI Studio is the hosted backend behind PanelUI's Feedback — reports, screenshots and two-way conversations, with an inbox for your team.
- [Quickstart](https://panelui.dev/docs/studio/quickstart): Create a Studio project, install the SDK and send the first report from an Expo, React Native or web app.
- [Feedback](https://panelui.dev/docs/studio/feedback): What a report can carry, how screenshots are uploaded, and what happens when a workspace reaches its monthly allowance.
- [Custom forms](https://panelui.dev/docs/studio/custom-forms): Ask the questions your team needs alongside the message — a plan, a rating, a checkbox — and get answers Studio has already checked.
- [Conversations](https://panelui.dev/docs/studio/conversations): Show a user their reports and your team's replies, and let them answer — with the React hooks or the client directly.
- [Support](https://panelui.dev/docs/studio/support): Let people start a conversation from your app — not just answer yours — and reply from a Support inbox that works like Feedback.
- [Announcements](https://panelui.dev/docs/studio/announcements): Write a message once in Studio and show it in every app that asks — release notes, maintenance windows, a feature to try.
- [Identify users](https://panelui.dev/docs/studio/identify-users): Studio works with anonymous installs by default. When your app has sign-in, attach the user so the inbox shows who wrote.
- [Webhooks](https://panelui.dev/docs/studio/webhooks): Get a signed HTTP request in your own backend when a report arrives, changes or gets a reply.
- [API reference](https://panelui.dev/docs/studio/api-reference): Every client method, React hook, type and error code in panelui-studio, and the HTTP endpoints behind them.

## Utilities

- [cn](https://panelui.dev/docs/utilities/cn): Merge Tailwind classes with conflicts resolved.
