=== Text Prefix & Suffix ===
Contributors:      slickdesign
Tags:              block
Tested up to:      7.1
Stable tag:        1.0.0
Plugin URI:        https://wordpress.org/plugins/text-prefix-suffix/
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html

Add decorative text before or after Paragraph and Heading blocks.

== Description ==

Select a Paragraph or Heading block, open the Styles tab in the block settings sidebar, and expand **Prefix & Suffix**. Enter text in either field. Your additions appear in the editor and on the published page.

Prefixes and suffixes are displayed using CSS `::before` and `::after` pseudoelements, and are purely used for decoration. Put any text readers need to understand the content directly in the block.

Note that some plugins or themes may use the same CSS pseudo-elements on Paragraph and Heading blocks - in those instances, the prefixes or suffixes may not be visible.

[Source code](https://github.com/slick-design/text-prefix-suffix) is available on GitHub. To build the editor script, run `npm ci` and `npm run build` from the repository root.

== Changelog ==

= 1.0.0 =
* Add prefix & suffix fields to paragraph and heading blocks
