import React, { useEffect } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Paper from '@mui/material/Paper';
import { WorkflowRun, WorkflowRunJob } from '../../utils/types';
import { useWorkflowRunJobs } from '../../hooks/useWorkflowRunJobs';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import Typography from '@mui/material/Typography';
import { Progress } from '@backstage/core-components';
// ts-ignore
// @ts-ignore
const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    // @ts-ignore
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    maxHeight: 250,
    // @ts-ignore
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  tabs: {
    flex: 1,
    // @ts-ignore
    borderRight: `1px solid ${theme.palette.divider}`,
  },
  timelineContainer: {
    flex: 3,
    maxHeight: 250,
    overflowY: 'scroll',
  },
  'dot-success': {
    backgroundColor: '#1a7f37',
  },
  'dot-error': {
    backgroundColor: 'rgba(255,129,130,0.4)',
  },
  'dot-warning': {
    backgroundColor: '#bf8700',
  },
  'dot-default': {
    backgroundColor: '#e2e2e2',
  },
}));

export function ActionDetailPanel({ rowData }: { rowData: WorkflowRun }) {
  const [activeJobId, setActiveJobId] = React.useState<string>('');
  const classes = useStyles();

  const handleChange = (_event: React.ChangeEvent<{}>, newValue: string) => {
    setActiveJobId(newValue);
  };

  const { data, isLoading, isError } = useWorkflowRunJobs({
    run_id: rowData.id,
    repoPath: rowData.repository.full_name,
  });

  useEffect(() => {
    if (data?.jobs && data?.total_count > 0) {
      setActiveJobId(data.jobs[0].id);
    }
  }, [data]);

  if (isLoading || isError) {
    return <Progress />;
  }

  return (
    <Paper
      square
      elevation={0}
      classes={{
        root: classes.root,
      }}
    >
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={activeJobId}
        onChange={handleChange}
        className={classes.tabs}
      >
        {data?.jobs.map(job => (
          <Tab label={job.name} id={job.id} value={job.id} />
        ))}
      </Tabs>
      <Paper
        classes={{
          root: classes.timelineContainer,
        }}
        square
        elevation={0}
      >
        {data?.jobs.map(job => (
          <WorkflowRunJobCard
            job={job}
            key={job.id}
            activeJobId={activeJobId}
            classes={classes}
          />
        ))}
      </Paper>
    </Paper>
  );
}

function WorkflowRunJobCard({
  job,
  activeJobId,
  classes,
}: {
  job: WorkflowRunJob;
  activeJobId: string;
  classes: ReturnType<typeof useStyles>;
}) {
  if (job.id !== activeJobId) {
    return null;
  }

  let status: 'success' | 'warning' | 'error' | 'default';

  switch (job.status) {
    case 'completed':
    case 'success':
      status = 'success';
      break;
    case 'action_required':
    case 'queued':
    case 'pending':
    case 'in_progress':
    case 'waiting':
      status = 'error';
      break;
    case 'cancelled':
    case 'failure':
    case 'timed_out':
      status = 'warning';
      break;
    default:
      status = 'default';
  }
  return (
    <Timeline>
      {job.steps.map(step => (
        <TimelineItem key={step.name}>
          <TimelineOppositeContent>
            <Typography color="textSecondary" variant="caption">
              {`${new Date(step.completed_at).toLocaleDateString()}`}
            </Typography>
            <br />
            <Typography color="textSecondary" variant="caption">
              {`${new Date(step.completed_at).toLocaleTimeString()}`}
            </Typography>
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot
              color="grey"
              classes={{
                root: classes[`dot-${status}`],
              }}
            />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <Typography variant="caption">{step.name}</Typography>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
}
