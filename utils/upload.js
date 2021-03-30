import moment from "moment"
import "moment-duration-format"

export const convertTimeFromSeconds =  (seconds) => {
	return moment.duration(seconds,'seconds').format('h [hours] m [minutes] s [seconds]')

}
