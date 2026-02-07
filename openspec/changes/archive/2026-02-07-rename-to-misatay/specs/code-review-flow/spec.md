## MODIFIED Requirements

### Requirement: Agent uses navigation tools to show code
The agent SHALL use openFile, highlightLines, and navigateToLine tools to guide the user through changes.

#### Scenario: Opening a file for review
- **WHEN** agent shows a file that was modified
- **THEN** agent calls dshearer.misatay/openFile with the file path

#### Scenario: Highlighting relevant sections
- **WHEN** agent wants to draw attention to specific code
- **THEN** agent calls dshearer.misatay/highlightLines with appropriate line range

#### Scenario: Centering code in viewport
- **WHEN** agent wants to ensure code is visible
- **THEN** agent calls dshearer.misatay/navigateToLine to center it
