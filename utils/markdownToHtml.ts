/**
 * Converts Markdown to HTML for Word document export
 * Properly handles tables, headings, lists, and formatting
 */

export function convertMarkdownToHtml(markdown: string): string {
    let html = markdown;

    // First, handle tables (before other replacements to preserve structure)
    html = convertTables(html);

    // Handle headings
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // Handle bold and italic
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Handle unordered lists
    html = html.replace(/^\s*[-*]\s+(.+)$/gim, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');

    // Handle numbered lists
    html = html.replace(/^\s*\d+\.\s+(.+)$/gim, '<li>$1</li>');

    // Handle line breaks (but not inside already processed elements)
    html = html.replace(/\n\n/g, '</p><p>');
    html = html.replace(/\n/g, '<br>');

    // Wrap in paragraph if not already structured
    if (!html.startsWith('<')) {
        html = '<p>' + html + '</p>';
    }

    return html;
}

/**
 * Convert markdown tables to HTML tables
 */
function convertTables(content: string): string {
    const lines = content.split('\n');
    const result: string[] = [];
    let inTable = false;
    let tableRows: string[] = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        // Check if this is a table row (starts and ends with |, or has | in between)
        const isTableRow = /^\|(.+)\|$/.test(line) || /^.+\|.+$/.test(line);
        const isSeparator = /^[\|\s:-]+$/.test(line) && line.includes('-');

        if (isTableRow && !isSeparator) {
            if (!inTable) {
                inTable = true;
                tableRows = [];
            }
            tableRows.push(line);
        } else if (isSeparator && inTable) {
            // Skip separator line but stay in table
            continue;
        } else {
            // Not a table row
            if (inTable && tableRows.length > 0) {
                // End of table, convert collected rows
                result.push(buildHtmlTable(tableRows));
                tableRows = [];
                inTable = false;
            }
            result.push(line);
        }
    }

    // Handle table at end of content
    if (inTable && tableRows.length > 0) {
        result.push(buildHtmlTable(tableRows));
    }

    return result.join('\n');
}

/**
 * Build HTML table from markdown rows
 */
function buildHtmlTable(rows: string[]): string {
    if (rows.length === 0) return '';

    let html = '<table style="width: 100%; border-collapse: collapse; margin: 1em 0;">';

    rows.forEach((row, index) => {
        // Parse cells - remove leading/trailing pipes and split
        let cleanRow = row.trim();
        if (cleanRow.startsWith('|')) cleanRow = cleanRow.slice(1);
        if (cleanRow.endsWith('|')) cleanRow = cleanRow.slice(0, -1);

        const cells = cleanRow.split('|').map(cell => cell.trim());

        html += '<tr>';
        cells.forEach(cell => {
            // First row is header
            const tag = index === 0 ? 'th' : 'td';
            const style = index === 0
                ? 'border: 1px solid #000; padding: 8px; background-color: #f0f0f0; font-weight: bold; text-align: center;'
                : 'border: 1px solid #000; padding: 8px; vertical-align: top;';
            html += `<${tag} style="${style}">${cell}</${tag}>`;
        });
        html += '</tr>';
    });

    html += '</table>';
    return html;
}

export default convertMarkdownToHtml;
