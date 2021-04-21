# gh-actions-ntfy-slack

This action sends the job's status to slack.


## Inputs

### `job-status`

**Required** Pass in ${{job.status}}

### `slack-channel`:

**Required** The slack channel the message is sent to

### `slack-bot-token`

**Required** The slack bot's token


## Example usage

```yaml
uses: aexeagmbh/gh-actions-ntfy-slack
with:
  job-status: ${{ job.status }}
  slack-channel: ${{ secrets.SLACK_CHANNEL }}
  slack-bot-token: ${{ secrets.SLACK_BOT_TOKEN }}
if: always()
```
