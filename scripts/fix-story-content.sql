-- Run once in Supabase → SQL Editor to repair stories saved with entity-encoded HTML.

-- Step 1: Decode entity-encoded HTML (e.g. &lt;h3&gt; → <h3>)
UPDATE stories
SET content = replace(
  replace(
    replace(
      replace(
        replace(content, '&lt;', '<'),
        '&gt;', '>'),
      '&quot;', '"'),
    '&#39;', ''''),
  '&amp;', '&')
WHERE content LIKE '%&lt;%'
   OR content LIKE '%&gt;%'
   OR content LIKE '%&amp;%';

-- Step 2: Wrap plain-text stories (created before rich text editor) in <p> tags
UPDATE stories
SET content = '<p>' || replace(replace(trim(content), E'\r\n\r\n', '</p><p>'), E'\n\n', '</p><p>') || '</p>'
WHERE content NOT LIKE '%<%'
  AND published = true;
