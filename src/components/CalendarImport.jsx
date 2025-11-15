import { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { FiUpload } from 'react-icons/fi';
import ICAL from 'ical.js';
import { toast } from 'react-toastify';
import styles from 'styles/CalendarImport.module.css';

const CalendarImport = ({ onImport }) => {
  const fileInputRef = useRef(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileClick = () => {
    fileInputRef.current.click();
  };

  const parseICalFile = (fileContent) => {
    try {
      const jcalData = ICAL.parse(fileContent);
      const comp = new ICAL.Component(jcalData);
      const vevents = comp.getAllSubcomponents('vevent');
      const events = [];

      vevents.forEach((vevent) => {
        const event = new ICAL.Event(vevent);
        const title = event.summary || 'Untitled Task';
        const dueDate = event.endDate || event.startDate;
        const description = event.description || '';

        if (dueDate) {
          events.push({
            title,
            dueDate: dueDate.toJSDate(),
            comment: description,
          });
        }
      });

      return events;
    } catch (error) {
      throw new Error('Failed to parse calendar file. Please ensure it is a valid .ics file.');
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['.ics', '.ical', '.ifb', '.icalendar'];
    const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();

    if (!validTypes.includes(fileExtension)) {
      toast.error('Please upload a valid calendar file (.ics, .ical)');
      return;
    }

    setIsProcessing(true);

    try {
      const fileContent = await file.text();
      const events = parseICalFile(fileContent);

      if (events.length === 0) {
        toast.warning('No events with dates found in the calendar file');
        setIsProcessing(false);
        return;
      }

      onImport(events);
      toast.success(`✅ Successfully imported ${events.length} event${events.length > 1 ? 's' : ''}!`);
    } catch (error) {
      toast.error(`❌ ${error.message}`);
    } finally {
      setIsProcessing(false);
      e.target.value = '';
    }
  };

  return (
    <div className={styles.importContainer}>
      <input
        ref={fileInputRef}
        type="file"
        accept=".ics,.ical,.ifb,.icalendar"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <button
        type="button"
        className={styles.importButton}
        onClick={handleFileClick}
        disabled={isProcessing}
        title="Import calendar file (.ics)"
      >
        <FiUpload className={styles.icon} />
        <span className={styles.buttonText}>
          {isProcessing ? 'Importing...' : 'Import Calendar'}
        </span>
      </button>
    </div>
  );
};

CalendarImport.propTypes = {
  onImport: PropTypes.func.isRequired,
};

export default CalendarImport;
