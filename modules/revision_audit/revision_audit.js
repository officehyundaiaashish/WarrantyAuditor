/**
 * Warranty Auditor — Revision Audit Module
 * Self-contained module: Injects CSS, HTML modal, and handles workspace version controls.
 */

(function () {
    // ── 1. MODULE STYLES (PREMIUM UIX) ──
    const styles = `
    #revision-audit-container {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        flex-wrap: wrap;
    }

    .btn-revision-audit {
        background: linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(168, 85, 247, 0.15));
        color: #6366f1;
        border: 1px solid rgba(99, 102, 241, 0.35);
        font-weight: 600;
        font-size: 0.78rem;
        padding: 6px 12px;
        border-radius: 8px;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        cursor: pointer;
        transition: all 0.2s ease;
        white-space: nowrap;
    }

    .btn-revision-audit:hover {
        background: linear-gradient(135deg, rgba(99, 102, 241, 0.25), rgba(168, 85, 247, 0.25));
        border-color: rgba(99, 102, 241, 0.6);
        transform: translateY(-1px);
        box-shadow: 0 4px 14px rgba(99, 102, 241, 0.2);
    }

    .btn-revision-audit:active {
        transform: translateY(0);
    }

    .revision-version-bar {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        background: rgba(0, 0, 0, 0.04);
        padding: 3px;
        border-radius: 8px;
        border: 1px solid var(--border, rgba(229, 231, 235, 0.8));
        flex-wrap: wrap;
    }

    .revision-version-pill {
        padding: 4px 10px;
        font-size: 0.73rem;
        font-weight: 600;
        border-radius: 6px;
        border: 1px solid transparent;
        background: transparent;
        color: var(--text-muted, #6b7280);
        cursor: pointer;
        transition: all 0.2s ease;
        white-space: nowrap;
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        line-height: 1.15;
    }

    .revision-version-pill .rev-pill-title {
        font-weight: 700;
    }

    .revision-version-pill .rev-pill-time {
        font-size: 0.62rem;
        opacity: 0.8;
        font-weight: 400;
        margin-top: 1px;
    }

    .revision-version-pill:hover {
        color: var(--text-main, #1f2937);
        background: rgba(255, 255, 255, 0.6);
    }

    .revision-version-pill.active {
        background: var(--bg-card, #ffffff);
        color: var(--primary, #2ab5a5);
        border-color: rgba(42, 181, 165, 0.3);
        font-weight: 700;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
    }

    /* Modern Glassmorphic Backdrop */
    .rev-modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(15, 23, 42, 0.6);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        z-index: 99999;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        padding: 16px;
    }

    .rev-modal-backdrop.active {
        opacity: 1;
        pointer-events: auto;
    }

    /* Modal Sheet Dialog */
    .rev-modal-sheet {
        background: var(--bg-card, #ffffff);
        color: var(--text-main, #1e293b);
        width: 100%;
        max-width: 540px;
        border-radius: 20px;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35);
        border: 1px solid var(--border, #e2e8f0);
        overflow: hidden;
        transform: scale(0.94) translateY(12px);
        transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .rev-modal-backdrop.active .rev-modal-sheet {
        transform: scale(1) translateY(0);
    }

    .rev-modal-header {
        padding: 20px 24px 16px;
        border-bottom: 1px solid var(--border, #f1f5f9);
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .rev-modal-header-title {
        display: flex;
        flex-direction: column;
        gap: 2px;
    }

    .rev-modal-tag {
        font-size: 0.65rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        color: #6366f1;
        background: rgba(99, 102, 241, 0.1);
        padding: 2px 8px;
        border-radius: 4px;
        width: fit-content;
    }

    .rev-modal-title {
        margin: 4px 0 0 0;
        font-size: 1.15rem;
        font-weight: 700;
        color: var(--text-main, #0f172a);
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .rev-modal-close {
        background: rgba(0, 0, 0, 0.04);
        border: none;
        font-size: 1.25rem;
        color: var(--text-muted, #94a3b8);
        cursor: pointer;
        width: 32px;
        height: 32px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: 0.15s;
    }

    .rev-modal-close:hover {
        background: rgba(239, 68, 68, 0.1);
        color: #ef4444;
    }

    .rev-modal-body {
        padding: 20px 24px;
    }

    .rev-modal-subtitle {
        font-size: 0.85rem;
        color: var(--text-muted, #64748b);
        margin-top: 0;
        margin-bottom: 18px;
        line-height: 1.5;
    }

    /* Option Cards */
    .rev-options-grid {
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-bottom: 20px;
    }

    .rev-option-card {
        border: 2px solid var(--border, #e2e8f0);
        border-radius: 14px;
        padding: 16px;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        align-items: flex-start;
        gap: 14px;
        background: var(--bg-base, #fafafa);
        position: relative;
    }

    .rev-option-card:hover {
        border-color: rgba(99, 102, 241, 0.5);
        background: rgba(99, 102, 241, 0.02);
    }

    .rev-option-card.selected {
        border-color: #6366f1;
        background: rgba(99, 102, 241, 0.04);
        box-shadow: 0 4px 12px rgba(99, 102, 241, 0.12);
    }

    .rev-option-radio {
        margin-top: 3px;
        accent-color: #6366f1;
        width: 18px;
        height: 18px;
        cursor: pointer;
    }

    .rev-option-content {
        flex: 1;
    }

    .rev-option-title {
        font-weight: 700;
        font-size: 0.92rem;
        color: var(--text-main, #1e293b);
        margin-bottom: 4px;
        display: flex;
        align-items: center;
        gap: 6px;
    }

    .rev-option-desc {
        font-size: 0.78rem;
        color: var(--text-muted, #64748b);
        line-height: 1.35;
    }

    /* Drag and Drop File Upload Zone */
    .rev-dropzone {
        margin-top: 14px;
        border: 2px dashed rgba(99, 102, 241, 0.4);
        border-radius: 12px;
        padding: 18px 14px;
        text-align: center;
        background: #ffffff;
        transition: all 0.2s ease;
        cursor: pointer;
    }

    .rev-dropzone:hover, .rev-dropzone.dragover {
        border-color: #6366f1;
        background: rgba(99, 102, 241, 0.05);
        transform: scale(1.01);
    }

    .rev-dropzone-icon {
        width: 36px;
        height: 36px;
        margin: 0 auto 8px;
        border-radius: 50%;
        background: rgba(99, 102, 241, 0.1);
        color: #6366f1;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .rev-file-card {
        display: flex;
        align-items: center;
        gap: 12px;
        background: #ffffff;
        border: 1px solid rgba(16, 185, 129, 0.4);
        padding: 10px 14px;
        border-radius: 10px;
        margin-top: 12px;
        text-align: left;
    }

    .rev-file-card-icon {
        width: 32px;
        height: 32px;
        border-radius: 8px;
        background: rgba(16, 185, 129, 0.1);
        color: #10b981;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
    }

    .rev-file-card-info {
        flex: 1;
        min-width: 0;
    }

    .rev-file-card-name {
        font-size: 0.82rem;
        font-weight: 700;
        color: #0f172a;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .rev-file-card-size {
        font-size: 0.72rem;
        color: #64748b;
        margin-top: 2px;
    }

    .rev-file-card-remove {
        cursor: pointer;
        color: #94a3b8;
        padding: 4px;
        border-radius: 4px;
        transition: 0.15s;
    }

    .rev-file-card-remove:hover {
        color: #ef4444;
        background: rgba(239, 68, 68, 0.1);
    }

    .rev-info-banner {
        background: rgba(16, 185, 129, 0.08);
        border: 1px solid rgba(16, 185, 129, 0.3);
        border-radius: 10px;
        padding: 10px 14px;
        font-size: 0.78rem;
        color: #059669;
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .rev-modal-footer {
        padding: 16px 24px 20px;
        border-top: 1px solid var(--border, #f1f5f9);
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 10px;
        background: var(--bg-base, #fafafa);
    }

    .rev-btn-cancel {
        padding: 9px 18px;
        font-size: 0.82rem;
        font-weight: 600;
        border: 1px solid var(--border, #cbd5e1);
        background: #ffffff;
        color: var(--text-main, #475569);
        border-radius: 10px;
        cursor: pointer;
        transition: 0.15s;
    }

    .rev-btn-cancel:hover {
        background: rgba(0, 0, 0, 0.04);
    }

    .rev-btn-confirm {
        padding: 9px 22px;
        font-size: 0.82rem;
        font-weight: 700;
        border: none;
        background: linear-gradient(135deg, #6366f1, #4f46e5);
        color: #ffffff;
        border-radius: 10px;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
        transition: all 0.2s ease;
        display: inline-flex;
        align-items: center;
        gap: 6px;
    }

    .rev-btn-confirm:hover {
        box-shadow: 0 6px 18px rgba(99, 102, 241, 0.4);
        transform: translateY(-1px);
    }

    .rev-btn-confirm:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
    }
    `;

    function injectStyles() {
        if (!document.getElementById('rev-audit-style')) {
            const styleTag = document.createElement('style');
            styleTag.id = 'rev-audit-style';
            styleTag.textContent = styles;
            document.head.appendChild(styleTag);
        }
    }

    // ── 2. INJECT MODAL HTML INTO BODY ──
    const modalHtml = `
    <div id="rev-sheet-backdrop" class="rev-modal-backdrop">
        <div class="rev-modal-sheet" onclick="event.stopPropagation()">
            <div class="rev-modal-header">
                <div class="rev-modal-header-title">
                    <span class="rev-modal-tag">REVISION AUDIT</span>
                    <h4 class="rev-modal-title">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M21.5 2v6h-6"></path>
                            <path d="M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path>
                        </svg>
                        Create Revision Audit
                    </h4>
                </div>
                <button class="rev-modal-close" onclick="RevisionAuditModule.closeRevisionSheet()">&times;</button>
            </div>

            <div class="rev-modal-body">
                <p class="rev-modal-subtitle">
                    Create a new revision of this audit. The current audit (<strong id="rev-parent-name">Audit 1</strong>) will be 
                    <strong>100% preserved and saved</strong>. Markings for the new revision will start fresh.
                </p>

                <div class="rev-options-grid">
                    <!-- Option 1: New Upload -->
                    <div class="rev-option-card" id="rev-card-new" onclick="RevisionAuditModule.selectOption('new')">
                        <input type="radio" name="rev-option" id="rev-opt-new" class="rev-option-radio" value="new" checked>
                        <div class="rev-option-content">
                            <div class="rev-option-title">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                                Upload a new warranty claim list
                            </div>
                            <div class="rev-option-desc">Upload an updated Excel (.xlsx, .xls) or CSV claim file for this audit period.</div>

                            <div id="rev-upload-panel" style="display: block;">
                                <div class="rev-dropzone" id="rev-dropzone" onclick="document.getElementById('rev-file-input').click()">
                                    <div class="rev-dropzone-icon">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                                    </div>
                                    <div style="font-size:0.82rem; font-weight:700; color:#1e293b;">Click to Browse or Drag & Drop File</div>
                                    <div style="font-size:0.72rem; color:#64748b; margin-top:2px;">Supports Excel (.xlsx, .xls) and CSV (.csv)</div>
                                    <input type="file" id="rev-file-input" class="rev-file-input" accept=".xlsx, .xls, .csv" onchange="RevisionAuditModule.handleFileSelect(event)">
                                </div>
                                <div id="rev-file-card-wrap"></div>
                            </div>
                        </div>
                    </div>

                    <!-- Option 2: Reuse Existing -->
                    <div class="rev-option-card" id="rev-card-existing" onclick="RevisionAuditModule.selectOption('existing')">
                        <input type="radio" name="rev-option" id="rev-opt-existing" class="rev-option-radio" value="existing">
                        <div class="rev-option-content">
                            <div class="rev-option-title">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                                Use existing warranty claim list
                            </div>
                            <div class="rev-option-desc">Re-use the exact claim list from Audit 1, but clear all pass/fail/remarks to conduct a fresh revision.</div>
                        </div>
                    </div>
                </div>

                <div class="rev-info-banner">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                    <span>New revision will be generated as <strong id="rev-next-name" style="font-weight:700;">Audit 2</strong>.</span>
                </div>
            </div>

            <div class="rev-modal-footer">
                <button class="rev-btn-cancel" onclick="RevisionAuditModule.closeRevisionSheet()">Cancel</button>
                <button class="rev-btn-confirm" id="rev-btn-submit" onclick="RevisionAuditModule.confirmCreateRevision()">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    Create Revision
                </button>
            </div>
        </div>
    </div>`;

    function injectModal() {
        if (!document.getElementById('rev-sheet-backdrop')) {
            const wrapper = document.createElement('div');
            wrapper.innerHTML = modalHtml;
            document.body.appendChild(wrapper.firstElementChild);

            // Drag and drop event listeners
            setTimeout(() => {
                const dropzone = document.getElementById('rev-dropzone');
                if (dropzone) {
                    ['dragenter', 'dragover'].forEach(eventName => {
                        dropzone.addEventListener(eventName, (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            dropzone.classList.add('dragover');
                        }, false);
                    });
                    ['dragleave', 'drop'].forEach(eventName => {
                        dropzone.addEventListener(eventName, (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            dropzone.classList.remove('dragover');
                        }, false);
                    });
                    dropzone.addEventListener('drop', (e) => {
                        const dt = e.dataTransfer;
                        const files = dt.files;
                        if (files && files.length > 0) {
                            const fileInput = document.getElementById('rev-file-input');
                            if (fileInput) {
                                fileInput.files = files;
                                handleFileSelect({ target: { files: files } });
                            }
                        }
                    }, false);
                }
            }, 100);
        }
    }

    // ── 3. MODULE LOGIC ──
    let _activeSessionKey = null;
    let _selectedOption = 'new';
    let _uploadedFile = null;

    function formatCreationTime(dateStr) {
        if (!dateStr) return '';
        try {
            const d = new Date(dateStr);
            if (isNaN(d.getTime())) return dateStr;
            const dayMonth = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
            const timeStr = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
            return `${dayMonth}, ${timeStr}`;
        } catch (e) {
            return '';
        }
    }

    function getRevisionFamily(sessionKey) {
        if (!sessionKey || !window.dbIndex) return [];
        const currentMeta = window.dbIndex[sessionKey];
        const rootKey = (currentMeta && currentMeta.root_key) ? currentMeta.root_key : sessionKey;

        const family = [];
        for (const [key, meta] of Object.entries(window.dbIndex)) {
            const metaRoot = meta.root_key || key;
            if (metaRoot === rootKey) {
                family.push({
                    key: key,
                    meta: meta,
                    revNum: meta.revision_number || 1,
                    createdAt: meta.created_at || meta.last_saved || ''
                });
            }
        }
        family.sort((a, b) => a.revNum - b.revNum);
        return family;
    }

    function initWorkspace(sessionKey) {
        injectStyles();
        injectModal();

        sessionKey = sessionKey || window.currentSessionKey;
        _activeSessionKey = sessionKey;

        const container = document.getElementById('revision-audit-container');
        if (!container) return;

        container.innerHTML = '';

        if (sessionKey && window.dbIndex && !window.dbIndex[sessionKey]) {
            const titleEl = document.getElementById('workspace-title');
            window.dbIndex[sessionKey] = {
                month: titleEl ? titleEl.innerText : 'Current Audit',
                last_saved: new Date().toLocaleString(),
                finalized: false,
                revision_number: 1,
                created_at: new Date().toISOString()
            };
        }

        const family = sessionKey ? getRevisionFamily(sessionKey) : [];

        // Render "Revision Audit" button
        const revBtn = document.createElement('button');
        revBtn.className = 'btn-revision-audit';
        revBtn.title = 'Create a new version/revision of this audit';
        revBtn.onclick = openRevisionSheet;
        revBtn.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21.5 2v6h-6"></path>
                <path d="M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path>
            </svg>
            <span>Revision Audit</span>
        `;
        container.appendChild(revBtn);

        // Render Version Navigation Switcher Bar
        if (family.length > 0) {
            const versionBar = document.createElement('div');
            versionBar.className = 'revision-version-bar';

            family.forEach(item => {
                const pill = document.createElement('button');
                pill.className = `revision-version-pill ${item.key === sessionKey ? 'active' : ''}`;
                const timeLabel = formatCreationTime(item.createdAt);

                pill.innerHTML = `
                    <span class="rev-pill-title">Audit ${item.revNum}</span>
                    ${timeLabel ? `<span class="rev-pill-time">${timeLabel}</span>` : ''}
                `;
                pill.title = `Audit ${item.revNum} — Created: ${item.createdAt || 'N/A'}`;
                pill.onclick = () => switchVersion(item.key);
                versionBar.appendChild(pill);
            });

            container.appendChild(versionBar);
        }
    }

    function openRevisionSheet() {
        _activeSessionKey = _activeSessionKey || window.currentSessionKey;
        if (!_activeSessionKey) {
            const titleEl = document.getElementById('workspace-title');
            _activeSessionKey = 'audit_' + Date.now();
            window.currentSessionKey = _activeSessionKey;
        }

        if (!window.dbIndex) window.dbIndex = {};
        if (!window.dbIndex[_activeSessionKey]) {
            const titleEl = document.getElementById('workspace-title');
            window.dbIndex[_activeSessionKey] = {
                month: titleEl ? titleEl.innerText : 'Current Audit',
                last_saved: new Date().toLocaleString(),
                finalized: false,
                revision_number: 1,
                created_at: new Date().toISOString()
            };
        }

        const family = getRevisionFamily(_activeSessionKey);
        const currentMeta = window.dbIndex[_activeSessionKey] || { revision_number: 1 };
        const nextRevNum = family.length > 0 ? (family[family.length - 1].revNum + 1) : 2;

        const parentNameEl = document.getElementById('rev-parent-name');
        const nextNameEl = document.getElementById('rev-next-name');
        if (parentNameEl) parentNameEl.innerText = `Audit ${currentMeta.revision_number || 1}`;
        if (nextNameEl) nextNameEl.innerText = `Audit ${nextRevNum}`;

        _selectedOption = 'new';
        _uploadedFile = null;
        const fileInput = document.getElementById('rev-file-input');
        const cardWrap = document.getElementById('rev-file-card-wrap');
        if (fileInput) fileInput.value = '';
        if (cardWrap) cardWrap.innerHTML = '';

        selectOption('new');

        const sheet = document.getElementById('rev-sheet-backdrop');
        if (sheet) sheet.classList.add('active');
    }

    function closeRevisionSheet() {
        const sheet = document.getElementById('rev-sheet-backdrop');
        if (sheet) sheet.classList.remove('active');
    }

    function selectOption(option) {
        _selectedOption = option;
        const cardNew = document.getElementById('rev-card-new');
        const cardExisting = document.getElementById('rev-card-existing');
        const optNew = document.getElementById('rev-opt-new');
        const optExisting = document.getElementById('rev-opt-existing');
        const uploadPanel = document.getElementById('rev-upload-panel');

        if (cardNew) cardNew.classList.toggle('selected', option === 'new');
        if (cardExisting) cardExisting.classList.toggle('selected', option === 'existing');

        if (optNew) optNew.checked = (option === 'new');
        if (optExisting) optExisting.checked = (option === 'existing');

        if (uploadPanel) uploadPanel.style.display = (option === 'new') ? 'block' : 'none';
    }

    function handleFileSelect(evt) {
        const files = evt.target.files;
        if (files && files.length > 0) {
            _uploadedFile = files[0];
            const cardWrap = document.getElementById('rev-file-card-wrap');
            let fileSize = (_uploadedFile.size / 1024).toFixed(2) + ' KB';
            if (_uploadedFile.size > 1024 * 1024) fileSize = (_uploadedFile.size / (1024 * 1024)).toFixed(2) + ' MB';

            if (cardWrap) {
                cardWrap.innerHTML = `
                    <div class="rev-file-card">
                        <div class="rev-file-card-icon">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>
                        </div>
                        <div class="rev-file-card-info">
                            <div class="rev-file-card-name">${_uploadedFile.name}</div>
                            <div class="rev-file-card-size">${fileSize}</div>
                        </div>
                        <div class="rev-file-card-remove" onclick="event.stopPropagation(); RevisionAuditModule.clearFileSelect()">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </div>
                    </div>
                `;
            }
        }
    }

    function clearFileSelect() {
        _uploadedFile = null;
        const fileInput = document.getElementById('rev-file-input');
        const cardWrap = document.getElementById('rev-file-card-wrap');
        if (fileInput) fileInput.value = '';
        if (cardWrap) cardWrap.innerHTML = '';
    }

    async function confirmCreateRevision() {
        const activeKey = _activeSessionKey || window.currentSessionKey;
        if (!activeKey) return;

        if (typeof window.showLoader === 'function') window.showLoader(true);

        try {
            const family = getRevisionFamily(activeKey);
            const currentMeta = (window.dbIndex && window.dbIndex[activeKey]) ? window.dbIndex[activeKey] : { revision_number: 1 };
            const rootKey = currentMeta.root_key || activeKey;
            const nextRevNum = family.length > 0 ? (family[family.length - 1].revNum + 1) : 2;

            // ── 1. GUARANTEE AUDIT 1 IS 100% SAVED & PRESERVED ──
            let parentSession = await window.localforage.getItem(activeKey);
            const titleEl = document.getElementById('workspace-title');
            const monthTitle = parentSession ? parentSession.month : (titleEl ? titleEl.innerText : 'Current Audit');

            const audit1Data = JSON.parse(JSON.stringify(window.currentAuditData || (parentSession ? parentSession.audit_data : {}) || {}));
            const audit1Claims = JSON.parse(JSON.stringify(window.currentData || (parentSession ? parentSession.filtered_data : []) || []));
            const audit1ColMap = JSON.parse(JSON.stringify(window.colMap || (parentSession ? parentSession.col_map : {}) || {}));

            const parentSessionToSave = {
                month: monthTitle,
                year: (parentSession && parentSession.year) || '',
                last_saved: new Date().toLocaleString(),
                finalized: (parentSession && parentSession.finalized) || false,
                col_map: audit1ColMap,
                audit_data: audit1Data, // Audit 1 markings saved 100%!
                filtered_data: audit1Claims,
                root_key: rootKey,
                revision_number: (parentSession && parentSession.revision_number) || 1,
                created_at: (parentSession && parentSession.created_at) || new Date().toISOString()
            };

            await window.localforage.setItem(activeKey, parentSessionToSave);
            if (!window.dbIndex) window.dbIndex = {};
            window.dbIndex[activeKey] = {
                month: monthTitle,
                last_saved: parentSessionToSave.last_saved,
                finalized: parentSessionToSave.finalized,
                root_key: rootKey,
                revision_number: parentSessionToSave.revision_number,
                created_at: parentSessionToSave.created_at
            };

            if (typeof window.saveSessionToDB === 'function') {
                await window.saveSessionToDB(parentSessionToSave, activeKey);
            }

            // ── 2. PROCESS NEW REVISION (AUDIT 2+) ──
            let filteredData = [];
            let colMapToUse = audit1ColMap;

            if (_selectedOption === 'new') {
                if (!_uploadedFile) {
                    if (typeof window.showLoader === 'function') window.showLoader(false);
                    return window.showAppAlert ? window.showAppAlert("Please select an Excel or CSV file to upload.") : alert("Please select a file.");
                }

                const parsed = await parseUploadedFile(_uploadedFile, colMapToUse);
                filteredData = parsed.filteredData;
                colMapToUse = parsed.colMap;
            } else {
                filteredData = JSON.parse(JSON.stringify(audit1Claims));
            }

            const nowIso = new Date().toISOString();
            const nowDisplay = new Date().toLocaleString();
            const newKey = `${rootKey}_rev_${nextRevNum}_${Date.now()}`;

            const newSession = {
                month: monthTitle,
                year: parentSessionToSave.year || '',
                last_saved: nowDisplay,
                finalized: false,
                col_map: colMapToUse,
                audit_data: {}, // Audit 2 starts 100% FRESH!
                filtered_data: filteredData,
                root_key: rootKey,
                revision_number: nextRevNum,
                created_at: nowIso
            };

            await window.localforage.setItem(newKey, newSession);
            window.dbIndex[newKey] = {
                month: monthTitle,
                last_saved: nowDisplay,
                finalized: false,
                root_key: rootKey,
                revision_number: nextRevNum,
                created_at: nowIso
            };

            await window.localforage.setItem('db_index', window.dbIndex);
            if (typeof window.saveSessionToDB === 'function') {
                await window.saveSessionToDB(newSession, newKey);
            }

            closeRevisionSheet();
            if (typeof window.showLoader === 'function') window.showLoader(false);
            if (typeof window.showToast === 'function') window.showToast(`Audit ${nextRevNum} created successfully! Markings cleared.`, 'success', 4000);

            // Load newly created revision into workspace
            await window.loadSession(newKey);
            initWorkspace(newKey);

        } catch (e) {
            if (typeof window.showLoader === 'function') window.showLoader(false);
            console.error(e);
            if (typeof window.showAppAlert === 'function') window.showAppAlert("Failed to create revision: " + e.message);
        }
    }

    function parseUploadedFile(file, existingColMap) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = function (e) {
                try {
                    const data = new Uint8Array(e.target.result);
                    const workbook = window.XLSX.read(data, { type: 'array' });
                    const jsonData = window.XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { defval: "" });
                    if (jsonData.length === 0) return reject(new Error("Uploaded file is empty."));

                    let colMap = window.detectColumns ? window.detectColumns(Object.keys(jsonData[0])) : existingColMap;
                    if (!colMap.claim_no) colMap = existingColMap;

                    const filteredData = jsonData.filter(row => {
                        const type = String(row[colMap.claim_type] || "").toUpperCase();
                        const amt = parseFloat(row[colMap.amount]) || 0;
                        const desc = String(row[colMap.part_desc] || "").toUpperCase();
                        if (type.includes("FREE SERVICE") || type.includes("FSC")) return false;
                        if (type.includes("CAMPAIGN") && amt < 300 && !desc.includes("POWER WINDOW") && !desc.includes("FUEL PUMP")) return false;
                        return true;
                    });

                    if (filteredData.length === 0) {
                        return reject(new Error("No valid claims found in uploaded file after filtering."));
                    }

                    resolve({ filteredData, colMap });
                } catch (err) {
                    reject(err);
                }
            };
            reader.onerror = () => reject(new Error("Error reading uploaded file."));
            reader.readAsArrayBuffer(file);
        });
    }

    async function switchVersion(targetKey) {
        if (!targetKey || targetKey === _activeSessionKey) return;
        if (typeof window.loadSession === 'function') {
            await window.loadSession(targetKey);
            initWorkspace(targetKey);
        }
    }

    // Export module globally
    window.RevisionAuditModule = {
        initWorkspace: initWorkspace,
        openRevisionSheet: openRevisionSheet,
        closeRevisionSheet: closeRevisionSheet,
        selectOption: selectOption,
        handleFileSelect: handleFileSelect,
        clearFileSelect: clearFileSelect,
        confirmCreateRevision: confirmCreateRevision,
        switchVersion: switchVersion
    };

    // Auto-init on load if workspace is active
    document.addEventListener('DOMContentLoaded', () => {
        injectStyles();
        injectModal();
        if (window.currentSessionKey || (document.getElementById('screen-workspace') && document.getElementById('screen-workspace').classList.contains('active'))) {
            initWorkspace(window.currentSessionKey);
        }
    });

    if (document.readyState === 'interactive' || document.readyState === 'complete') {
        injectStyles();
        injectModal();
        if (window.currentSessionKey || (document.getElementById('screen-workspace') && document.getElementById('screen-workspace').classList.contains('active'))) {
            initWorkspace(window.currentSessionKey);
        }
    }

})();
