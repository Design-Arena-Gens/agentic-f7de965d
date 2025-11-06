package com.example.shortcuts;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

/**
 * Provides lifecycle management and lookup capabilities for shortcut entries.
 */
public class ShortcutManager {
    private final List<ShortcutEntry> entries = new ArrayList<>();

    public List<ShortcutEntry> getEntries() {
        return Collections.unmodifiableList(entries);
    }

    public void addShortcut(ShortcutEntry entry) {
        entries.add(entry);
    }

    public boolean updateShortcut(ShortcutEntry entry) {
        for (int i = 0; i < entries.size(); i++) {
            if (entries.get(i).getId().equals(entry.getId())) {
                entries.set(i, entry);
                return true;
            }
        }
        return false;
    }

    public boolean deleteShortcut(UUID id) {
        return entries.removeIf(entry -> entry.getId().equals(id));
    }

    public String findExpansion(String textToMatch) {
        if (textToMatch == null) {
            return null;
        }

        for (ShortcutEntry entry : entries) {
            String trigger = entry.getKeyword() + entry.getCommand();
            if (textToMatch.endsWith(trigger)) {
                return entry.getExpansionText();
            }
        }

        return null;
    }
}
