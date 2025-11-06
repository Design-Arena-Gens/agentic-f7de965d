"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import styles from "./page.module.css";
import { ShortcutEntry } from "@/lib/shortcuts/ShortcutEntry";
import { ShortcutManager } from "@/lib/shortcuts/ShortcutManager";

type ShortcutDraft = {
  id?: string;
  command: string;
  keyword: string;
  expansionText: string;
};

const emptyDraft: ShortcutDraft = {
  command: "",
  keyword: "",
  expansionText: "",
};

export default function Home() {
  const managerRef = useRef(new ShortcutManager());
  const [entries, setEntries] = useState<ShortcutEntry[]>([]);
  const [draft, setDraft] = useState<ShortcutDraft>(emptyDraft);
  const [textToMatch, setTextToMatch] = useState("");
  const [expansion, setExpansion] = useState<string | null>(null);

  useEffect(() => {
    setEntries(managerRef.current.getEntries());
  }, []);

  const heading = useMemo(
    () => (draft.id ? "Update shortcut" : "Create a new shortcut"),
    [draft.id],
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const entry = new ShortcutEntry({
      id: draft.id,
      command: draft.command.trim(),
      keyword: draft.keyword.trim(),
      expansionText: draft.expansionText,
    });

    if (draft.id) {
      managerRef.current.updateShortcut(entry);
    } else {
      managerRef.current.addShortcut(entry);
    }

    setEntries(managerRef.current.getEntries());
    setDraft(emptyDraft);
  };

  const handleEdit = (entry: ShortcutEntry) => {
    setDraft({
      id: entry.getId(),
      command: entry.getCommand(),
      keyword: entry.getKeyword(),
      expansionText: entry.getExpansionText(),
    });
  };

  const handleDelete = (entry: ShortcutEntry) => {
    managerRef.current.deleteShortcut(entry.getId());
    setEntries(managerRef.current.getEntries());
    if (draft.id === entry.getId()) {
      setDraft(emptyDraft);
    }
  };

  const handleTest = () => {
    const match = managerRef.current.findExpansion(textToMatch);
    setExpansion(match);
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <section className={styles.card}>
          <h1 className={styles.title}>Shortcut Manager</h1>
          <p className={styles.subtitle}>
            Define commands that expand into full text snippets.
          </p>
        </section>

        <section className={styles.card}>
          <h2>{heading}</h2>
          <form className={styles.form} onSubmit={handleSubmit}>
            <label className={styles.field}>
              <span>Command</span>
              <input
                type="text"
                value={draft.command}
                onChange={(event) =>
                  setDraft((previous) => ({
                    ...previous,
                    command: event.target.value,
                  }))
                }
                placeholder="!sc"
                required
              />
            </label>
            <label className={styles.field}>
              <span>Keyword</span>
              <input
                type="text"
                value={draft.keyword}
                onChange={(event) =>
                  setDraft((previous) => ({
                    ...previous,
                    keyword: event.target.value,
                  }))
                }
                placeholder="hello"
                required
              />
            </label>
            <label className={styles.field}>
              <span>Expansion text</span>
              <textarea
                value={draft.expansionText}
                onChange={(event) =>
                  setDraft((previous) => ({
                    ...previous,
                    expansionText: event.target.value,
                  }))
                }
                placeholder="Hello there! This is a full sentence."
                rows={4}
                required
              />
            </label>
            <div className={styles.actions}>
              <button type="submit" className={styles.button}>
                {draft.id ? "Update shortcut" : "Add shortcut"}
              </button>
              {draft.id && (
                <button
                  type="button"
                  className={`${styles.button} ${styles.secondaryButton}`}
                  onClick={() => setDraft(emptyDraft)}
                >
                  Cancel edit
                </button>
              )}
            </div>
          </form>
        </section>

        <section className={styles.card}>
          <h2>Configured shortcuts</h2>
          {entries.length === 0 ? (
            <p className={styles.empty}>No shortcuts yet.</p>
          ) : (
            <ul className={styles.list}>
              {entries.map((entry) => (
                <li key={entry.getId()} className={styles.listItem}>
                  <div>
                    <strong>{entry.getKeyword()}</strong>
                    <span className={styles.command}> + {entry.getCommand()}</span>
                    <p className={styles.expansionPreview}>
                      {entry.getExpansionText()}
                    </p>
                  </div>
                  <div className={styles.row}>
                    <button
                      type="button"
                      onClick={() => handleEdit(entry)}
                      className={`${styles.button} ${styles.secondaryButton}`}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(entry)}
                      className={`${styles.button} ${styles.dangerButton}`}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className={styles.card}>
          <h2>Test an expansion</h2>
          <div className={styles.testArea}>
            <input
              type="text"
              value={textToMatch}
              onChange={(event) => setTextToMatch(event.target.value)}
              placeholder="Type something like hello!sc"
            />
            <button
              type="button"
              onClick={handleTest}
              className={styles.button}
            >
              Find expansion
            </button>
          </div>
          <div className={styles.result}>
            <span>Result:</span>
            <p>{expansion ?? "No expansion found"}</p>
          </div>
        </section>
      </main>
    </div>
  );
}
